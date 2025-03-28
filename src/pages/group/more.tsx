import { useHooks } from "hooks";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t } = useHooks();

  if (!data) {
    return <p>{t("Loading...")}</p>;
  }

  return (
    <div>
      <div className="flex flex-col mb-[10px]">
        <div className="flex items-center">
          <p className="mr-[20px] font-semibold">{t("Group name")}:</p>
          <span>{data.name}</span>
        </div>

        <div className="flex items-center">
          <p className="mr-[20px] font-semibold">{t("Leader")}:</p>
          {data.leader ? (
            <span>{`${data.leader.firstName} ${data.leader.lastName} (${data.leader.username})`}</span>
          ) : (
            <span>{t("No leader assigned")}</span>
          )}
        </div>
      </div>

      <div className="mr-[20px]">
        <p className="font-semibold">{t("Players")}:</p>
        {data.players.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">{t("First Name")}</th>
                <th className="border border-gray-300 px-4 py-2">{t("Last Name")}</th>
                <th className="border border-gray-300 px-4 py-2">{t("Username")}</th>
              </tr>
            </thead>
            <tbody>
              {data.players.map((player: any) => (
                <tr key={player._id}>
                  <td className="border border-gray-300 px-4 py-2">{player.firstName}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.lastName}</td>
                  <td className="border border-gray-300 px-4 py-2">{player.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span>{t("No players in this group")}</span>
        )}
      </div>
    </div>
  );
};

export default More;
