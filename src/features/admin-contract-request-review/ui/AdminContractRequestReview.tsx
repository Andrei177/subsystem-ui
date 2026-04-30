import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { NavBar } from "@/widgets/navbar";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/shared";

import type {
  ApproveContractRequestReq,
  ContractRequestInfo,
  ContractRequestStatus,
  RateLimitPeriod,
} from "@/entities/request";
import { adminContractRequestReviewApi } from "../api/adminContractRequestReviewApi";

const RATE_LIMIT_PERIODS: RateLimitPeriod[] = [
  "SECOND",
  "MINUTE",
  "HOUR",
  "DAY",
  "WEEK",
  "MONTH",
];

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
      "Произошла ошибка"
    );
  }

  return "Произошла непредвиденная ошибка";
};

type Props = {
  requestId: number;
};

export const AdminContractRequestReview = ({ requestId }: Props) => {
  const [request, setRequest] = useState<ContractRequestInfo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const loadRequest = () => {
    return adminContractRequestReviewApi
      .getById(requestId)
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        setRequest(null);
        toast.error(getErrorMessage(err));
      });
  };

  useEffect(() => {
    let ignore = false;

    adminContractRequestReviewApi
      .getById(requestId)
      .then((res) => {
        if (!ignore) {
          setRequest(res.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setRequest(null);
          toast.error(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [requestId]);

  const reloadCurrentRequest = () => {
    return loadRequest();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <NavBar />

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              Загрузка заявки...
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-muted/30">
        <NavBar />

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              Заявка #{requestId} не найдена или недоступна.
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <section className="rounded-2xl border bg-background p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Администрирование
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
              Рассмотрение заявки #{request.requestId}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Изучите сведения о приложении и примите решение: одобрить заявку с
              выбранными операциями или отклонить её с указанием причины.
            </p>
          </div>
        </section>

        <AdminRequestDetails
          request={request}
          onApproveClick={() => setIsApproveModalOpen(true)}
          onRejectClick={() => setIsRejectModalOpen(true)}
        />
      </main>

      {isApproveModalOpen && (
        <ApproveRequestModal
          request={request}
          onClose={() => setIsApproveModalOpen(false)}
          onApproved={() => {
            setIsApproveModalOpen(false);
            reloadCurrentRequest();
          }}
        />
      )}

      {isRejectModalOpen && (
        <RejectRequestModal
          request={request}
          onClose={() => setIsRejectModalOpen(false)}
          onRejected={() => {
            setIsRejectModalOpen(false);
            reloadCurrentRequest();
          }}
        />
      )}
    </div>
  );
};

type AdminRequestDetailsProps = {
  request: ContractRequestInfo;
  onApproveClick: () => void;
  onRejectClick: () => void;
};

const AdminRequestDetails = ({
  request,
  onApproveClick,
  onRejectClick,
}: AdminRequestDetailsProps) => {
  const canProcess = request.status === "PENDING";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Заявка #{request.requestId}
            </p>

            <CardTitle className="mt-1 text-2xl">{request.appName}</CardTitle>
          </div>

          <span
            className={[
              "w-fit rounded-full px-3 py-1 text-sm font-medium",
              getStatusClassName(request.status),
            ].join(" ")}
          >
            {getStatusLabel(request.status)}
          </span>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <InfoItem
            label="Ссылка на приложение"
            value={request.appUrl}
            isLink
          />
          <InfoItem label="Email представителя" value={request.contactEmail} />
          <InfoItem label="Redirect URI" value={request.redirectUri} />
          <InfoItem
            label="Политика конфиденциальности"
            value={request.privacyPolicyUrl}
            isLink
          />
          <InfoItem label="Создана" value={formatDate(request.createdAt)} />
          <InfoItem
            label="Рассмотрена"
            value={formatDate(request.reviewedAt)}
          />

          <div className="md:col-span-2">
            <InfoBlock
              label="Описание приложения"
              value={request.appDescription}
            />
          </div>

          <div className="md:col-span-2">
            <InfoBlock
              label="Цели интеграции"
              value={request.integrationGoals}
            />
          </div>

          {request.additionalNotes && (
            <div className="md:col-span-2">
              <InfoBlock
                label="Дополнительные комментарии"
                value={request.additionalNotes}
              />
            </div>
          )}

          {request.rejectReason && (
            <div className="md:col-span-2">
              <InfoBlock label="Причина отказа" value={request.rejectReason} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Запрошенные операции</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          {request.desiredOperations.map((operation) => (
            <span
              key={operation}
              className="rounded-full bg-muted px-3 py-1 text-sm font-medium"
            >
              {operation}
            </span>
          ))}
        </CardContent>
      </Card>

      {request.approvedOperationGroups &&
        request.approvedOperationGroups.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Одобренные операции</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-2">
              {request.approvedOperationGroups.map((operation) => (
                <span
                  key={operation}
                  className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                >
                  {operation}
                </span>
              ))}
            </CardContent>
          </Card>
        )}

      {request.contract && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Созданный контракт</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            <InfoItem
              label="ID контракта"
              value={String(request.contract.contractId)}
            />
            <InfoItem label="Статус" value={request.contract.status} />
            <InfoItem label="Client ID" value={request.contract.clientId} />
            <InfoItem
              label="Rate limit"
              value={`${request.contract.rateLimitValue} / ${request.contract.rateLimitPeriod}`}
            />
          </CardContent>
        </Card>
      )}

      {canProcess ? (
        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onRejectClick}
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            Отклонить заявку
          </Button>

          <Button type="button" onClick={onApproveClick}>
            Одобрить заявку
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            Заявка уже обработана. Повторное одобрение или отклонение
            недоступно.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

type ApproveRequestModalProps = {
  request: ContractRequestInfo;
  onClose: () => void;
  onApproved: () => void;
};

const ApproveRequestModal = ({
  request,
  onClose,
  onApproved,
}: ApproveRequestModalProps) => {
  const [approvedOperationGroups, setApprovedOperationGroups] = useState<
    string[]
  >(request.desiredOperations);

  const [rateLimitValue, setRateLimitValue] = useState(100);
  const [rateLimitPeriod, setRateLimitPeriod] =
    useState<RateLimitPeriod>("MINUTE");

  const [isLoading, setIsLoading] = useState(false);

  const toggleOperation = (operation: string) => {
    setApprovedOperationGroups((prev) =>
      prev.includes(operation)
        ? prev.filter((item) => item !== operation)
        : [...prev, operation],
    );
  };

  const handleApprove = () => {
    if (approvedOperationGroups.length === 0) {
      toast.error("Выберите хотя бы одну одобренную операцию");
      return;
    }

    if (!rateLimitValue || rateLimitValue <= 0) {
      toast.error("Лимит запросов должен быть больше 0");
      return;
    }

    const payload: ApproveContractRequestReq = {
      approvedOperationGroups,
      rateLimitValue,
      rateLimitPeriod,
    };

    setIsLoading(true);

    adminContractRequestReviewApi
      .approve(request.requestId, payload)
      .then((res) => {
        toast.success(res.data.message);
        onApproved();
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal title={`Одобрение заявки #${request.requestId}`} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Выберите операции, которые будут включены в контракт.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {request.desiredOperations.map((operation) => {
              const checked = approvedOperationGroups.includes(operation);

              return (
                <label
                  key={operation}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOperation(operation)}
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium">{operation}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Лимит запросов</label>

            <Input
              type="number"
              min={1}
              value={rateLimitValue}
              onChange={(e) => setRateLimitValue(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Период лимита</label>

            <select
              value={rateLimitPeriod}
              onChange={(e) =>
                setRateLimitPeriod(e.target.value as RateLimitPeriod)
              }
              className="h-10 rounded-md border bg-background px-3 py-2 text-sm"
            >
              {RATE_LIMIT_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>

          <Button type="button" onClick={handleApprove} disabled={isLoading}>
            {isLoading ? "Одобрение..." : "Одобрить и создать контракт"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

type RejectRequestModalProps = {
  request: ContractRequestInfo;
  onClose: () => void;
  onRejected: () => void;
};

const RejectRequestModal = ({
  request,
  onClose,
  onRejected,
}: RejectRequestModalProps) => {
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Укажите причину отказа");
      return;
    }

    setIsLoading(true);

    adminContractRequestReviewApi
      .reject(request.requestId, {
        rejectReason,
      })
      .then((res) => {
        toast.success(res.data.message);
        onRejected();
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal title={`Отклонение заявки #${request.requestId}`} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Причина отказа</label>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Например: приложение не соответствует требованиям безопасности..."
            className="min-h-32 rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>

          <Button
            type="button"
            onClick={handleReject}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Отклонение..." : "Отклонить заявку"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ title, children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-background p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

type InfoItemProps = {
  label: string;
  value: string;
  isLink?: boolean;
};

const InfoItem = ({ label, value, isLink = false }: InfoItemProps) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>

      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="break-all text-base font-medium underline-offset-4 hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="wrap-break-word text-base font-medium">{value}</span>
      )}
    </div>
  );
};

type InfoBlockProps = {
  label: string;
  value: string;
};

const InfoBlock = ({ label, value }: InfoBlockProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>

      <p className="whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-base leading-7">
        {value}
      </p>
    </div>
  );
};
