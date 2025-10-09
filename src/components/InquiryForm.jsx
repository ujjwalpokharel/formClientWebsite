import { Button, Form } from "antd";
import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { renderFormItem } from "../service/RenderForm";
import { fetcher, headers, openNotification } from "../service/constant";
import axios from "axios";

const InquiryForm = (props) => {
  const [form] = Form.useForm();
  const [dynamicData, setDynamicData] = useState({});
  const [formId, setFormId] = useState();
  const sigCanvasRefs = useRef({});
  const [formFields, setFormFields] = useState();
  const { organisationId, initialFormId } = props;
  const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;
  const prefix = import.meta.env.VITE_PUBLIC_API_PREFIX;
  const url = organisationId
    ? `${apiUrl}/${prefix}/forms/${initialFormId}`
    : null;
  const formSubmissionsUrl = `${apiUrl}/${prefix}/form-submissions/client-website`;
  const { data: responseData } = useSWR(url, fetcher);

  useEffect(() => {
    if (responseData) {
      setFormFields(responseData?.definition?.fields);
      setFormId(responseData?.id);
    }
  }, [responseData]);

  const onFinish = async (values) => {
    const formData = new FormData();
    let entityId;
    Object.keys(values).forEach((key) => {
      if (key !== "signature" && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });
    if (values.signature) {
      formData.append("signatureImage", values.signature);
    }
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    try {
      const inquiriesurl = `${apiUrl}/${prefix}/inquiries`;
      const inquiryValues = {
       inquirerFirstName: values.inquirerFirstName,
      };
      const inquiryResponse = await axios.post(inquiriesurl, inquiryValues, {
        headers,
      });
      entityId = inquiryResponse.data?.id;
    } catch (clientError) {
      console.error("Client or Inquiry creation failed:", clientError);
    }
    try {
      const allValues = {
        ...formDataObj,
        formId,
        ...(entityId && { entityId }),
        orgId: organisationId ? Number(organisationId) : null,
      };
      await axios.post(formSubmissionsUrl, allValues, { headers });
      openNotification(`Successfully Added.`);
      form.resetFields();
    } catch (error) {
      console.error("Failed to submit form:", error);
      openNotification("Error submitting form!", true);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {formFields?.map((field) =>
          renderFormItem(field, dynamicData, sigCanvasRefs, form)
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InquiryForm;
