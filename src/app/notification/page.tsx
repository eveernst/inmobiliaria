"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getNotifications, NoticeRecord } from "@/api/notificationApi";

// Notice types created by the system (registration success and daily expiry check).
const NOTICE_TYPE_LABELS: Record<string, string> = {
  "due-date": "Vencimiento",
  "registration-success": "Alta",
};

const formatNoticeDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" });
};

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
      router.replace("/login");
      return;
    }

    getNotifications()
      .then((data) => {
        // Newest first.
        setNotices([...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      })
      .catch(() => setError("No se pudieron cargar los avisos."))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 py-6 text-slate-100 md:py-8">
      <div className="page-container">
        <div className="mb-4 flex">
          <button type="button" onClick={() => router.push("/")} className="action-button-secondary">
            ← Volver
          </button>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl">Avisos</h1>
          <p className="mt-2 text-slate-400">
            Avisos generados por el sistema: altas registradas y vencimientos de seguros, formularios anuales y contratos de alquiler.
          </p>
        </div>

        {loading && <p className="py-16 text-center text-slate-400">Cargando avisos...</p>}
        {!loading && error && <p className="form-error" role="alert">{error}</p>}
        {!loading && !error && notices.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-200">No tenés avisos</p>
          </div>
        )}

        {!loading && !error && notices.length > 0 && (
          <ul className="space-y-3">
            {notices.map((notice) => (
              <li key={notice.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      notice.type === "due-date"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {NOTICE_TYPE_LABELS[notice.type] ?? "Aviso"}
                  </span>
                  <time className="text-xs text-slate-400" dateTime={notice.date}>
                    {formatNoticeDate(notice.date)}
                  </time>
                </div>
                <p className="text-slate-100">{notice.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
