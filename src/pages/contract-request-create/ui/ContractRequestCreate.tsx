import { CreateRequest } from "@/features/create-request";
import { NavBar } from "@/widgets/navbar";

export const ContractRequestCreate = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <NavBar />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <section className="rounded-2xl border bg-background p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Новая заявка
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
              Создание заявки на формирование контракта для интеграции внешнего
              приложения
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Заполните сведения о приложении, целях интеграции, необходимых
              операциях API и OAuth redirect URI. После отправки администратор
              рассмотрит заявку и сформирует контракт доступа.
            </p>
          </div>
        </section>

        <section>
          <CreateRequest />
        </section>
      </main>
    </div>
  );
};
