import { useState, type SubmitEvent } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/shared";

import { createContractRequestApi } from "../api/createContractRequestApi";
import { OPERATION_GROUPS, useContractRequestStore } from "@/entities/request";

export const CreateRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const contractRequest = useContractRequestStore(
    (state) => state.contractRequest,
  );
  const setField = useContractRequestStore((state) => state.setField);
  const toggleDesiredOperation = useContractRequestStore(
    (state) => state.toggleDesiredOperation,
  );
  const resetContractRequest = useContractRequestStore(
    (state) => state.resetContractRequest,
  );

  const getErrorMessage = (err: unknown) => {
    if (err instanceof AxiosError) {
      return (
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Не удалось создать заявку"
      );
    }

    return "Произошла непредвиденная ошибка, попробуйте ещё раз";
  };

  const handleCreateRequest = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contractRequest.desiredOperations.length === 0) {
      toast.error("Выберите хотя бы одну желаемую операцию");
      return;
    }

    setIsLoading(true);

    try {
      await createContractRequestApi.create(contractRequest);

      toast.success("Заявка успешно создана");
      resetContractRequest();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          Создание заявки на интеграцию
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="create-contract-request-form"
          onSubmit={handleCreateRequest}
          className="flex flex-col gap-6"
        >
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Информация о приложении</h3>

            <Input
              name="appName"
              placeholder="Название приложения"
              value={contractRequest.appName}
              onChange={(e) => setField("appName", e.target.value)}
            />

            <Input
              name="appUrl"
              placeholder="Ссылка на приложение"
              value={contractRequest.appUrl}
              onChange={(e) => setField("appUrl", e.target.value)}
            />

            <Textarea
              name="appDescription"
              placeholder="Описание приложения"
              value={contractRequest.appDescription}
              onChange={(e) => setField("appDescription", e.target.value)}
            />

            <Input
              name="contactEmail"
              type="email"
              placeholder="Email представителя"
              value={contractRequest.contactEmail}
              onChange={(e) => setField("contactEmail", e.target.value)}
            />
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Интеграция</h3>

            <Textarea
              name="integrationGoals"
              placeholder="Цели интеграции"
              value={contractRequest.integrationGoals}
              onChange={(e) => setField("integrationGoals", e.target.value)}
            />

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium">Желаемые операции</p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {OPERATION_GROUPS.map((operation) => {
                  const checked = contractRequest.desiredOperations.includes(
                    operation.value,
                  );

                  return (
                    <label
                      key={operation.value}
                      className="flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-accent"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDesiredOperation(operation.value)}
                        className="h-4 w-4"
                      />

                      <span>{operation.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">OAuth</h3>

            <Input
              name="redirectUri"
              placeholder="Redirect URI"
              value={contractRequest.redirectUri}
              onChange={(e) => setField("redirectUri", e.target.value)}
            />
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Юридическая информация</h3>

            <Input
              name="privacyPolicyUrl"
              placeholder="Ссылка на политику конфиденциальности"
              value={contractRequest.privacyPolicyUrl}
              onChange={(e) => setField("privacyPolicyUrl", e.target.value)}
            />
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Дополнительно</h3>

            <Textarea
              name="additionalNotes"
              placeholder="Дополнительные комментарии"
              value={contractRequest.additionalNotes}
              onChange={(e) => setField("additionalNotes", e.target.value)}
            />
          </section>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={resetContractRequest}
        >
          Очистить
        </Button>

        <Button
          type="submit"
          form="create-contract-request-form"
          disabled={isLoading}
        >
          {isLoading ? "Создание..." : "Создать заявку"}
        </Button>
      </CardFooter>
    </Card>
  );
};
