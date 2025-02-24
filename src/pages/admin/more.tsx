import { useHooks } from "hooks";
import Avatar from "assets/images/27470334_7309681.jpg";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t } = useHooks();
  if (!data) {
    return <p>{t("Loading...")}</p>;
  }
  return (
    <div>
      <div className="flex">
        <div className="mr-[30px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("firstName")}:</p>
            </p>
            <b>{data.firstName}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("lastName")}:</p>
            </p>
            <b>{data.lastName}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("email")}:</p>
            </p>
            <b>{data.email}</b>
          </div>
        </div>
        <div className="mr-[20px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("username")}:</p>
            </p>
            <b>{data.username}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("Telefon raqam")}:</p>
            </p>
            <p>
              <a
                href={`tel:${data.phoneNumber}`}
                className="text-blue-500 hover:underline"
              >
                {data.phoneNumber}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="flex">
        <img
          src={data.photoUrl[0] || Avatar}
          alt="photo"
          className="w-[200px] h-[150px] object-cover rounded-[10px]"
        />
      </div>
    </div>
  );
};

export default More;
