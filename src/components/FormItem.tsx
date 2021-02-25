import React from "react";
import { ErrorMessage, Field, useField } from "formik";
import BootstrapForm from "react-bootstrap/Form";
import Datetime from "react-datetime";
import Col from "react-bootstrap/Col";

interface Props {
  label: string;
  field: string;
  labelWidth?: number;
  placeHolder?: string;
  readOnly?: boolean;
  type?: "text" | "number";
  showhelp?: boolean;
  helptext?: string;
  isDate?: boolean;
  customClass?: string;
  size?: "sm" | "lg";
}

export const FormItem: React.FC<Props> = ({
  label,
  field,
  labelWidth = 2,
  placeHolder,
  readOnly = false,
  type = "text",
  showhelp,
  helptext = "",
  isDate,
  customClass,
  size = "sm",
}) => {
  return (
    <BootstrapForm.Row>
      <BootstrapForm.Group as={Col}>
        <BootstrapForm.Label style={{ paddingLeft: "0" }} column={true}>
          {label}
        </BootstrapForm.Label>
        <Col sm={12} xl={12} style={{ paddingLeft: "0" }}>
          <Field
            name={field}
            as={isDate ? DateComponent : CustomInputComponent}
            placeholder={placeHolder || label.toLowerCase()}
            readOnly={readOnly}
            type={type}
            helptext={helptext}
            className={customClass}
            size={size}
          />
          <ErrorMessage className="red" name={field} component="div" />
        </Col>
      </BootstrapForm.Group>
    </BootstrapForm.Row>
  );
};

const DateComponent = (props: any) => {
  const [, , helpers] = useField(props.name);

  const { setValue } = helpers;

  const handleOnChange = (e: any) => {
    if (e.unix) {
      setValue(e.unix());
    }
  };

  return <Datetime className="custom" onChange={handleOnChange} />;
};

const CustomInputComponent = (props: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BootstrapForm.Control
        type="text"
        key="name"
        size={props.size}
        placeholder={props.field}
        {...props}
        style={{ marginRight: "10px" }}
      />
    </div>
  );
};
