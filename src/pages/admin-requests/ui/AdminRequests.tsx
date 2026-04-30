import { AdminContractRequestsList } from "@/features/admin-contract-requests-list";
import { NavBar } from "@/widgets/navbar";

export const AdminRequests = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <NavBar />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <section className="rounded-2xl border bg-background p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Администрирование
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
              Заявки на формирование контрактов
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Здесь отображаются все заявки представителей внешних приложений.
              Заявки со статусом «На рассмотрении» можно открыть и обработать.
            </p>
          </div>
        </section>

        <AdminContractRequestsList />
      </main>
    </div>
  );
};
