import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  href: string;
  icon: ReactNode;
};

export default function ActionCard({ title, subtitle, href, icon }: Props) {
  return (
    <Link
      href={href}
      className="
        group
        bg-white
        dark:bg-slate-900/40
        rounded-3xl
        border
        border-slate-100
        dark:border-slate-800
        p-6
        shadow-sm
        transition-all
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>

          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
