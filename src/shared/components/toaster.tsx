"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:px-4",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:px-4",
          success: "group-[.toaster]:bg-emerald-50 group-[.toaster]:dark:bg-emerald-950/30 group-[.toaster]:border-emerald-200 group-[.toaster]:dark:border-emerald-800",
          error: "group-[.toaster]:bg-red-50 group-[.toaster]:dark:bg-red-950/30 group-[.toaster]:border-red-200 group-[.toaster]:dark:border-red-800",
          warning: "group-[.toaster]:bg-yellow-50 group-[.toaster]:dark:bg-yellow-950/30 group-[.toaster]:border-yellow-200 group-[.toaster]:dark:border-yellow-800",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:dark:bg-blue-950/30 group-[.toaster]:border-blue-200 group-[.toaster]:dark:border-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
