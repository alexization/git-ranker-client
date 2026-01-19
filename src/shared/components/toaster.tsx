"use client"

import { Toaster as Sonner } from "sonner"
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      offset={24}
      gap={12}
      duration={3500}
      visibleToasts={3}
      closeButton={false}
      icons={{
        success: (
          <div className="toast-icon-success flex items-center justify-center w-5 h-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
        ),
        error: (
          <div className="toast-icon-error flex items-center justify-center w-5 h-5">
            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          </div>
        ),
        warning: (
          <div className="toast-icon-warning flex items-center justify-center w-5 h-5">
            <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          </div>
        ),
        info: (
          <div className="toast-icon-info flex items-center justify-center w-5 h-5">
            <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
        ),
        loading: (
          <div className="toast-icon-loading flex items-center justify-center w-5 h-5">
            <Loader2 className="w-5 h-5 text-primary" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-gray-900 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-gray-200/80 group-[.toaster]:dark:border-gray-700/80 group-[.toaster]:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-[.toaster]:dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] group-[.toaster]:rounded-2xl group-[.toaster]:px-4 group-[.toaster]:py-3.5 group-[.toaster]:gap-3 group-[.toaster]:items-center group-[.toaster]:min-w-[280px] group-[.toaster]:max-w-[380px]",
          title:
            "group-[.toast]:font-semibold group-[.toast]:text-[14px] group-[.toast]:leading-5 group-[.toast]:tracking-[-0.01em]",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-[13px] group-[.toast]:leading-5 group-[.toast]:mt-0.5",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:hover:opacity-90 group-[.toast]:active:scale-95",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:dark:bg-gray-800 group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:hover:bg-gray-200 group-[.toast]:dark:hover:bg-gray-700 group-[.toast]:active:scale-95",
          success:
            "group-[.toaster]:bg-emerald-50 group-[.toaster]:dark:bg-emerald-950/50 group-[.toaster]:border-emerald-200 group-[.toaster]:dark:border-emerald-800/50",
          error:
            "group-[.toaster]:bg-red-50 group-[.toaster]:dark:bg-red-950/50 group-[.toaster]:border-red-200 group-[.toaster]:dark:border-red-800/50",
          warning:
            "group-[.toaster]:bg-amber-50 group-[.toaster]:dark:bg-amber-950/50 group-[.toaster]:border-amber-200 group-[.toaster]:dark:border-amber-800/50",
          info:
            "group-[.toaster]:bg-blue-50 group-[.toaster]:dark:bg-blue-950/50 group-[.toaster]:border-blue-200 group-[.toaster]:dark:border-blue-800/50",
          loading:
            "group-[.toaster]:bg-white group-[.toaster]:dark:bg-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:dark:border-gray-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
