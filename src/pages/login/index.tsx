import { useState } from "react";
import { Container } from "modules";
import { notification } from "antd";
import { Fields, Button } from "components";
import { FastField } from "formik";
import { useHooks } from "hooks";
import useStore from "store";

const Login = ({ createModal }: any): JSX.Element => {
  const { get, t } = useHooks();
  const { signIn } = useStore((state) => state);
  const [isLogin, setIsLogin] = useState(true);
  let data = createModal?.data || {};

  const handleSuccess = (response: any) => {
    signIn({
      token: get(response, "data.token"),
      data: {
        username: get(response, "data.username"),
        role: "student",
      },
    });
  };

  const handleError = (error: any) => {
    notification.error({
      message: get(error, "errorMessage", t("Something went wrong!")),
      duration: 2,
    });
  };

  return (
    <section className="mx-[32%] mt-[8%]">
      <div className="flex justify-center mb-8">
        <Button
          onClick={() => setIsLogin(true)}
          title={t("Login")}
          className={`mx-2 px-4 py-2 rounded-lg ${
            isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } hover:bg-blue-700`}
        />
        <Button
          onClick={() => setIsLogin(false)}
          title={t("Register")}
          className={`mx-2 px-4 py-2 rounded-lg ${
            !isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } hover:bg-blue-700`}
        />
      </div>
      {isLogin ? (
        <Container.Form
          className="xl:max-w-[650px] lg:max-w-[450px] md:max-w-[400px] md:flex md:justify-center"
          url="/students/login"
          name="students"
          method="post"
          fields={[
            {
              type: "string",
              required: true,
              name: "username",
              value: get(data, "username"),
            },
            {
              type: "string",
              required: true,
              name: "password",
            },
          ]}
          onSuccess={handleSuccess}
          onError={handleError}
        >
          {({ isLoading, setFieldTouched }) => (
            <div>
              <h1 className="text-center text-[#000000DE] text-[32px] font-[600] mb-[8px]">
                {t("Welcome to")}{" "}
                <span className="text-[#3367F6]">{t("Student Dashboard")}</span>
              </h1>
              <p className="text-center text-[20px] text-[#9EA3B5] mb-[30px]">
                {t("Please enter your student credentials to login.")}
              </p>
              <FastField
                required
                name="username"
                isLoginPage={true}
                rootClassName="mb-3"
                placeholder={t("Login")}
                component={Fields.Input}
                setFieldTouched={setFieldTouched}
              />
              <FastField
                required
                name="password"
                type="password"
                rootClassName="mb-3"
                component={Fields.Password}
                placeholder={t("Password")}
              />
              <Button
                size="large"
                htmlType="submit"
                isLoading={isLoading}
                className="w-full h-auto"
                title={isLoading ? t("Please wait a second") : t("Log in")}
              />
            </div>
          )}
        </Container.Form>
      ) : (
        <Container.Form
          className="xl:max-w-[650px] lg:max-w-[450px] md:max-w-[400px] md:flex md:justify-center"
          url="/students/register"
          name="students"
          method="post"
          fields={[
            {
              type: "string",
              required: true,
              name: "firstName",
              value: get(data, "firstName"),
            },
            {
              type: "string",
              required: true,
              name: "lastName",
              value: get(data, "lastName"),
            },
            {
              type: "string",
              required: true,
              name: "username",
              value: get(data, "username"),
            },
            {
              type: "string",
              required: true,
              name: "password",
            },
          ]}
          onSuccess={handleSuccess}
          onError={handleError}
        >
          {({ isLoading, setFieldTouched }) => (
            <div>
              <h1 className="text-center text-[#000000DE] text-[32px] font-[600] mb-[5px]">
                {t("Welcome to")}{" "}
                <span className="text-[#3367F6]">{t("Student Dashboard")}</span>
              </h1>
              <p className="text-center text-[20px] text-[#9EA3B5] mb-[30px]">
                {t("Please enter your details to register.")}
              </p>
              <FastField
                required
                name="firstName"
                rootClassName="mb-3"
                component={Fields.Input}
                placeholder={t("First Name")}
                setFieldTouched={setFieldTouched}
              />
              <FastField
                required
                name="lastName"
                rootClassName="mb-3"
                placeholder={t("Last Name")}
                component={Fields.Input}
                setFieldTouched={setFieldTouched}
              />
              <FastField
                required
                name="username"
                rootClassName="mb-3"
                placeholder={t("Username")}
                component={Fields.Input}
                setFieldTouched={setFieldTouched}
              />
              <FastField
                required
                name="password"
                type="password"
                rootClassName="mb-3"
                component={Fields.Password}
                placeholder={t("Password")}
              />
              <Button
                size="large"
                htmlType="submit"
                isLoading={isLoading}
                className="w-full h-auto"
                title={isLoading ? t("Please wait a second") : t("Register")}
              />
            </div>
          )}
        </Container.Form>
      )}
    </section>
  );
};

export default Login;
