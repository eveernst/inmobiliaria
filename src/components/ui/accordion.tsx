"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type AccordionType = "single" | "multiple"

type AccordionValue = string | string[] | undefined

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType
  collapsible?: boolean
  value?: AccordionValue
  defaultValue?: AccordionValue
  onValueChange?: (value: AccordionValue) => void
}

type AccordionContextValue = {
  type: AccordionType
  collapsible: boolean
  values: string[]
  toggleItem: (itemValue: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      collapsible = false,
      value,
      defaultValue,
      onValueChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const toArray = React.useCallback(
      (v: AccordionValue): string[] => {
        if (Array.isArray(v)) return v
        if (typeof v === "string" && v.length > 0) return [v]
        return []
      },
      []
    )

    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<AccordionValue>(
      defaultValue
    )

    const currentValue = isControlled ? value : internalValue
    const values = toArray(currentValue)

    const setValue = React.useCallback(
      (next: AccordionValue) => {
        if (!isControlled) setInternalValue(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange]
    )

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        if (type === "single") {
          const isOpen = values[0] === itemValue
          const next = isOpen ? (collapsible ? undefined : itemValue) : itemValue
          setValue(next)
          return
        }

        const isOpen = values.includes(itemValue)
        const next = isOpen
          ? values.filter((v) => v !== itemValue)
          : [...values, itemValue]
        setValue(next)
      },
      [type, values, collapsible, setValue]
    )

    const contextValue = React.useMemo<AccordionContextValue>(
      () => ({
        type,
        collapsible,
        values,
        toggleItem,
      }),
      [type, collapsible, values, toggleItem]
    )

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

type AccordionItemContextValue = {
  value: string
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null)

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ className, value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={{ value }}>
    <div ref={ref} className={cn("border-b", className)} {...props}>
      {children}
    </div>
  </AccordionItemContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
