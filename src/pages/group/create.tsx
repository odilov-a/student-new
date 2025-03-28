import { Spin, notification } from "antd";
import { Field } from "formik";
import { useHooks } from "hooks";
import { Container } from "modules";
import { Fields, Button } from "components";
import { useState } from "react";

const Group = ({ showCreateModal, createModal }: any): JSX.Element => {
  const { t, get } = useHooks();
  let data = createModal.data && createModal?.data;

  const [selectedPlayers, setSelectedPlayers] = useState<any[]>(get(data, "players", []));

  return (
    <div>
      <Container.Form
        url={data._id ? `/groups/${get(data, "_id")}` : "/groups"}
        method={data._id ? "put" : "post"}
        name="groups"
        fields={[
          {
            name: "name",
            type: "string",
            required: true,
            value: get(data, "name"),
          },
          {
            type: "any",
            required: true,
            name: "players",
            value: selectedPlayers,
          },
          {
            type: "any",
            required: true,
            name: "leader",
            value: get(data, "leader"),
          },
        ]}
        onSuccess={(data, resetForm, query) => {
          query.invalidateQueries({ queryKey: ["groups"] });
          resetForm();
          showCreateModal(false);
        }}
        onError={(error) => {
          notification.error({
            message: get(error, "errorMessage", t("Something went wrong!")),
            duration: 2,
          });
        }}
      >
        {({ isLoading, setFieldValue }) => {
          return (
            <Spin spinning={isLoading} tip={t("Verifying")}>
              <div className="mt-5">
                <Field
                  required
                  name="name"
                  component={Fields.Input}
                  rootClassName="mr-2"
                  label={t("Group name")}
                  placeholder={t("Group name")}
                />
                
                {/* Players tanlash */}
                <Field
                  required
                  name="players"
                  url="/students"
                  isMulti={true}
                  optionValue="_id"
                  optionLabel="username"
                  label={t("Players")}
                  placeholder={t("Select players")}
                  component={Fields.AsyncSelect}
                  onChange={(value: any) => {
                    setSelectedPlayers(value); // O‘quvchilar ro‘yxatini saqlaymiz
                    setFieldValue("players", value);
                  }}
                />

                <Field
                  required
                  name="leader"
                  component={Fields.Select}
                  label={t("Leader")}
                  placeholder={t("Select leader")}
                  optionValue="_id"
                  optionLabel="username"
                  options={selectedPlayers}
                  onChange={(value: any) => {
                    setFieldValue("leader", value);
                  }}
                />

                <Button
                  size="large"
                  title={t("Save")}
                  htmlType="submit"
                  className="w-full mt-4"
                />
              </div>
            </Spin>
          );
        }}
      </Container.Form>
    </div>
  );
};

export default Group;
