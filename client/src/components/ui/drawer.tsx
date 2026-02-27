import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"

interface SoulDrawerProps extends React.ComponentProps<typeof DrawerPrimitive.Root> {
  shouldScaleBackground?: boolean;
}

const Drawer = ({ shouldScaleBackground = true, ...props }: SoulDrawerProps) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = "SoulDrawer"

const DrawerTrigger = DrawerPrimitive.Trigger
DrawerTrigger.displayName = "SoulDrawerTrigger"

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close
DrawerClose.displayName = "SoulDrawerClose"

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = "SoulDrawerOverlay"

interface SoulDrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  showHandle?: boolean;
  variant?: "default" | "forge" | "terminal";
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  SoulDrawerContentProps
>(({ className, children, showHandle = true, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "border-[#1a1a1a] bg-[#0a0a0a]/95",
    forge: "border-[#6B7B8D]/20 bg-[#0a0a0a]/95 shadow-[0_-4px_40px_rgba(107,123,141,0.1)]",
    terminal: "border-[#8A9AAD]/15 bg-[#050505]/98 shadow-[0_-4px_40px_rgba(138,154,173,0.06)]",
  };

  const handleColor = {
    default: "bg-white/20",
    forge: "bg-[#6B7B8D]/40 shadow-[0_0_8px_rgba(107,123,141,0.3)]",
    terminal: "bg-[#8A9AAD]/30 shadow-[0_0_8px_rgba(138,154,173,0.2)]",
  };

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24",
          "flex h-auto flex-col",
          "rounded-t-2xl border-t backdrop-blur-xl",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {showHandle && (
          <div className="flex justify-center pt-4 pb-1">
            <div
              className={cn(
                "h-1.5 w-12 rounded-full transition-all duration-300",
                handleColor[variant]
              )}
            />
          </div>
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
})
DrawerContent.displayName = "SoulDrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "grid gap-2 px-6 pt-4 pb-2",
      "text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DrawerHeader.displayName = "SoulDrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-auto flex flex-col gap-3 px-6 pb-6 pt-2",
      "border-t border-[#1a1a1a]",
      className
    )}
    {...props}
  />
)
DrawerFooter.displayName = "SoulDrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-brand font-bold text-white tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = "SoulDrawerTitle"

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-white/40 font-mono leading-relaxed",
      className
    )}
    {...props}
  />
))
DrawerDescription.displayName = "SoulDrawerDescription"

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
