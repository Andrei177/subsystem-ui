import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  AdminContractRequestShort,
  ContractRequestStatus,
  PageResponse,
} from "@/entities/request";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Routes,
} from "@/shared";

import { adminContractRequestsListApi } from "../api/adminContractRequestsListApi";

const LIMIT = 3;

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

export const AdminContractRequestsList = () => {
  const [page, setPage] = useState(1);
  const [data, setData] =
    useState<PageResponse<AdminContractRequestShort> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminContractRequestsListApi
      .getAll(page, LIMIT)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  const goToPage = (targetPage: number) => {
    setIsLoading(true);
    setPage(targetPage);
  };

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Загрузка заявок...
        </CardContent>
      </Card>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Заявок пока нет</h2>
          <p className="mt-1 text-muted-foreground">
            Когда представители начнут создавать заявки, они появятся здесь.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl">Все заявки</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Всего заявок: {data.total}
          </p>
        </div>

        {isLoading && (
          <span className="text-sm text-muted-foreground">Обновление...</span>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {data.items.map((request) => (
            <AdminRequestListItem key={request.requestId} request={request} />
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Страница {data.page}
            {data.totalPages > 0 && ` из ${data.totalPages}`}
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={data.page <= 1 || isLoading}
              onClick={() => goToPage(page - 1)}
            >
              Назад
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={data.page >= data.totalPages || isLoading}
              onClick={() => goToPage(page + 1)}
            >
              Вперёд
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type AdminRequestListItemProps = {
  request: AdminContractRequestShort;
};

const AdminRequestListItem = ({ request }: AdminRequestListItemProps) => {
  const isPending = request.status === "PENDING";

  return (
    <div className="rounded-xl border bg-background p-4 transition-colors hover:bg-accent/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            Заявка #{request.requestId}
          </p>

          <h3 className="mt-1 truncate text-lg font-semibold">
            {request.appName}
          </h3>

          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
            <span>{request.contactEmail}</span>
            <span>Создана: {formatDate(request.createdAt)}</span>
            {request.reviewedAt && (
              <span>Рассмотрена: {formatDate(request.reviewedAt)}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span
            className={[
              "w-fit rounded-full px-3 py-1 text-sm font-medium",
              getStatusClassName(request.status),
            ].join(" ")}
          >
            {getStatusLabel(request.status)}
          </span>

          {isPending ? (
            <Button asChild>
              <Link to={Routes.VIEW_REQUESTS + `/${request.requestId}`}>
                Рассмотреть
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to={Routes.VIEW_REQUESTS + `/${request.requestId}`}>
                Открыть
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
