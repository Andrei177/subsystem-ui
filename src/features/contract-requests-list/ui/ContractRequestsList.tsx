import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  ContractRequestShort,
  ContractRequestStatus,
} from "@/entities/request";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Routes,
} from "@/shared";

import { contractRequestsApi } from "../api/contractRequestsApi";

const getStatusLabel = (status: ContractRequestStatus) => {
  switch (status) {
    case "PENDING":
      return "На рассмотрении";
    case "APPROVED":
      return "Одобрена";
    case "REJECTED":
      return "Отклонена";
    default:
      return status;
  }
};

const getStatusClassName = (status: ContractRequestStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatDate = (date: string | null) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const getErrorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    return (
      err.response?.data?.message ??
      err.response?.data?.error ??
      "Не удалось загрузить заявки"
    );
  }

  return "Произошла непредвиденная ошибка";
};

export const ContractRequestsList = () => {
  const [requests, setRequests] = useState<ContractRequestShort[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contractRequestsApi
      .getMyRequests()
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Загрузка заявок...
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="text-xl font-semibold">Заявок пока нет</h2>
            <p className="mt-1 text-muted-foreground">
              Создайте первую заявку на интеграцию внешнего приложения.
            </p>
          </div>

          <Button asChild className="w-fit">
            <Link to={Routes.CONTRACT_REQUEST_CREATE}>Создать заявку</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Мои заявки</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {requests.map((request) => (
          <Link
            key={request.contractRequestId}
            to={`${Routes.CONTRACT_REQUESTS}/${request.contractRequestId}`}
            className="rounded-xl border p-4 transition-colors hover:bg-accent"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Заявка #{request.contractRequestId}
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  {request.appName}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Создана: {formatDate(request.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-sm font-medium",
                    getStatusClassName(request.status),
                  ].join(" ")}
                >
                  {getStatusLabel(request.status)}
                </span>

                {request.reviewedAt && (
                  <span className="text-xs text-muted-foreground">
                    Рассмотрена: {formatDate(request.reviewedAt)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
