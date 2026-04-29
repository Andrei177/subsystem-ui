import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  ContractRequestInfo as ContractRequestInfoType,
  ContractRequestStatus,
} from "@/entities/request";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared";

import { contractRequestInfoApi } from "../api/contractRequestInfoApi";

type Props = {
  requestId: number;
};

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
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "APPROVED":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "REJECTED":
      return "bg-red-100 text-red-800 hover:bg-red-100";
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
      "Не удалось загрузить информацию о заявке"
    );
  }

  return "Произошла непредвиденная ошибка";
};

export const ContractRequestInfo = ({ requestId }: Props) => {
  const [request, setRequest] = useState<ContractRequestInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contractRequestInfoApi
      .getById(requestId)
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [requestId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Загрузка информации о заявке...
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Заявка не найдена или у вас нет доступа к ней.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Заявка #{request.requestId}
            </p>

            <CardTitle className="mt-1 text-2xl">{request.appName}</CardTitle>
          </div>

          <Badge className={getStatusClassName(request.status)}>
            {getStatusLabel(request.status)}
          </Badge>
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
              <InfoBlock
                label="Причина отклонения"
                value={request.rejectReason}
              />
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
            <Badge key={operation} variant="secondary">
              {operation}
            </Badge>
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
                <Badge key={operation} variant="secondary">
                  {operation}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

      {request.contract ? (
        <ContractInfo contract={request.contract} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Контракт</CardTitle>
          </CardHeader>

          <CardContent className="text-muted-foreground">
            Контракт пока не сформирован. Он появится здесь после одобрения
            заявки администратором.
          </CardContent>
        </Card>
      )}
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
        <span className="break-words text-base font-medium">{value}</span>
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

type ContractInfoProps = {
  contract: NonNullable<ContractRequestInfoType["contract"]>;
};

const ContractInfo = ({ contract }: ContractInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Сформированный контракт</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <InfoItem label="ID контракта" value={String(contract.contractId)} />
          <InfoItem label="Статус" value={contract.status} />
          <InfoItem label="API Key" value={contract.apiKey} />
          <InfoItem label="Client ID" value={contract.clientId} />
          <InfoItem label="Redirect URI" value={contract.redirectUri} />
          <InfoItem label="Создан" value={formatDate(contract.createdAt)} />
          <InfoItem
            label="Rate limit"
            value={`${contract.rateLimitValue} / ${contract.rateLimitPeriod}`}
          />

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Client Secret</span>

            {contract.clientSecret ? (
              <code className="break-all rounded-md bg-muted px-3 py-2 text-sm">
                {contract.clientSecret}
              </code>
            ) : (
              <span className="text-base text-muted-foreground">
                Client Secret уже был скрыт или удалён
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Доступные endpoints</h3>

          {contract.endpoints.length === 0 ? (
            <p className="text-muted-foreground">Endpoints не указаны.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {contract.endpoints.map((endpoint) => (
                <div
                  key={`${endpoint.method}-${endpoint.path}-${endpoint.operationGroup}`}
                  className="flex flex-col gap-3 rounded-xl border p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary">
                        {endpoint.method.toUpperCase()}
                      </Badge>

                      <code className="break-all text-sm">{endpoint.path}</code>
                    </div>

                    <span className="text-sm text-muted-foreground">
                      {endpoint.operationGroup}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>
                      Auth:{" "}
                      {endpoint.requiresAuth ? "требуется" : "не требуется"}
                    </span>

                    {endpoint.requestContentType && (
                      <span>Content-Type: {endpoint.requestContentType}</span>
                    )}
                  </div>

                  <details className="rounded-lg bg-muted/50 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      Параметры запроса
                    </summary>

                    <pre className="mt-3 overflow-x-auto rounded-md bg-background p-3 text-xs">
                      {JSON.stringify(endpoint.requestParameters, null, 2)}
                    </pre>
                  </details>

                  <details className="rounded-lg bg-muted/50 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      Схема тела запроса
                    </summary>

                    <pre className="mt-3 overflow-x-auto rounded-md bg-background p-3 text-xs">
                      {JSON.stringify(endpoint.requestBodySchema, null, 2)}
                    </pre>
                  </details>

                  <details className="rounded-lg bg-muted/50 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      Ответы
                    </summary>

                    <pre className="mt-3 overflow-x-auto rounded-md bg-background p-3 text-xs">
                      {JSON.stringify(endpoint.responses, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
