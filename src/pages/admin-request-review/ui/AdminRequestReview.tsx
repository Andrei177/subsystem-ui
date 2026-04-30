import { AdminContractRequestReview } from "@/features/admin-contract-request-review";
import { NavBar } from "@/widgets/navbar";
import { useParams } from "react-router";

export const AdminRequestReview = () => {
  const { contractRequestId } = useParams();
  const parsedRequestId = Number(contractRequestId);

  if (!contractRequestId || Number.isNaN(parsedRequestId)) {
    return <div>Некорректный ID заявки</div>;
  }
  return (
    <>
      <NavBar />
      <AdminContractRequestReview requestId={parsedRequestId} />
    </>
  );
};
