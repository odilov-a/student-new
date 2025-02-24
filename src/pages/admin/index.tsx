import { useState } from "react";
import { Modal, Card } from "antd";
import { useHooks, useGet } from "hooks";
import { Edit } from "assets/images/icons";
import Update from "./create";
import More from "./more";
import Avatar from "assets/images/27470334_7309681.jpg";

const User = () => {
  const { Meta } = Card;
  const { get, t } = useHooks();
  const [editModal, showEditModal] = useState({ open: false, data: {} });
  const [moreModal, showMoreModal] = useState({ open: false, data: {} });
  const { data } = useGet({ name: "students", url: "/students/me" });
  const info = get(data, "data", {});

  return (
    <div className="flex">
      <Modal
        open={editModal.open}
        onCancel={() => showEditModal({ open: false, data: {} })}
        footer={null}
        centered
        title={t("Edit user")}
        width={500}
        destroyOnClose
      >
        <Update {...{ showEditModal, selectedCard: editModal.data }} />
      </Modal>
      <Modal
        open={moreModal.open}
        onCancel={() => showMoreModal({ open: false, data: {} })}
        footer={null}
        centered
        title={t("More information")}
        width={600}
        destroyOnClose
      >
        <More {...{ showMoreModal, moreModal }} />
      </Modal>
      <div>
        <Card onClick={() => showMoreModal({ open: true, data: info })}>
          <Meta
            title={
              <img
                className="object-cover rounded-[10px] w-[260px] h-[200px] cursor-pointer"
                src={get(info, "photoUrl.0", Avatar)}
                alt="User"
              />
            }
          />
          <div className="btnPanel">
            <div
              className="editBtn"
              onClick={(e) => {
                e.stopPropagation();
                showEditModal({ open: true, data: info });
              }}
            >
              <Edit />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default User;
