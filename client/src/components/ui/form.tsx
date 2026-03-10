import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, Label } from "./form-elements"

interface FormFieldProps {
  name: string
  children: React.ReactNode
}

function FormField({ children }: FormFieldProps) {
  return <div className="space-y-2">{children}</div>
}

interface FormItemProps extends React.ComponentProps<"div"> {}

function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn("space-y-2", className)} {...props} />
}

interface FormLabelProps extends React.ComponentProps<typeof Label> {}

function FormLabel({ className, ...props }: FormLabelProps) {
  return <Label className={cn(className)} {...props} />
}

interface FormControlProps extends React.ComponentProps<typeof Input> {}

function FormControl(props: FormControlProps) {
  return <Input {...props} />
}

interface FormMessageProps extends React.ComponentProps<"p"> {}

function FormMessage({ className, children, ...props }: FormMessageProps) {
  if (!children) return null
  return (
    <p className={cn("text-xs font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  )
}

interface FormProps extends React.ComponentProps<"form"> {}

function Form({ className, ...props }: FormProps) {
  return <form className={cn("space-y-6", className)} {...props} />
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
}
