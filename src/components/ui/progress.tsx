import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  indicatorColor?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, indicatorColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorColor)}
          style={{
            transform: `translateX(-${100 - (value / max) * 100}%)`,
          }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
