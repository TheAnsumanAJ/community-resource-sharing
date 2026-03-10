"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, RotateCcw, ArrowUpFromLine } from "lucide-react"

type BorrowRequestType = {
 id: string
 resourceId: string
 borrowerId: string
 status: string
 returnedAt?: string | null
 createdAt: string
 resource?: { title: string; ownerId?: string }
 borrower?: { name?: string; email: string }
}

const statusStyles: Record<string, string> = {
 pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
 approved: "bg-green-500/10 text-green-400 border-green-500/20",
 rejected: "bg-red-500/10 text-red-400 border-red-500/20",
 return_initiated: "bg-orange-500/10 text-orange-400 border-orange-500/20",
 returned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
}

const statusLabels: Record<string, string> = {
 pending: "Pending",
 approved: "Approved",
 rejected: "Rejected",
 return_initiated: "Return Pending",
 returned: "Returned",
}

export default function BorrowRequestCard({
 request,
 isOwner = false,
 isBorrower = false,
 onAccept,
 onReject,
 onReturn,
 onInitiateReturn,
}: {
 request: BorrowRequestType
 isOwner?: boolean
 isBorrower?: boolean
 onAccept?: (id: string) => void
 onReject?: (id: string) => void
 onReturn?: (id: string) => void
 onInitiateReturn?: (id: string) => void
}) {
 const statusKey = request.returnedAt ? "returned" : request.status

 return (
  <Card className="bg-card/60 border-border/50 hover:border-border transition-colors">
   <CardContent className="p-5">
    <div className="flex items-start justify-between mb-3">
     <div>
      <h4 className="font-semibold text-sm">
       {request.resource?.title || request.resourceId}
      </h4>
      <p className="text-xs text-muted-foreground mt-0.5">
       {isOwner
        ? `Borrower: ${request.borrower?.name || request.borrower?.email || request.borrowerId}`
        : `Owner's resource`}
      </p>
     </div>
     <Badge variant="outline" className={statusStyles[statusKey] || ""}>
      {statusLabels[statusKey] || statusKey}
     </Badge>
    </div>

    <p className="text-xs text-muted-foreground mb-4">
     {new Date(request.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
     })}
    </p>

    {/* Owner: Accept/Reject pending requests */}
    {isOwner && request.status === "pending" && !request.returnedAt && (
     <div className="flex gap-2">
      <Button
       size="sm"
       className="flex-1 gap-1"
       onClick={() => onAccept?.(request.id)}
      >
       <Check className="w-3 h-3" /> Accept
      </Button>
      <Button
       size="sm"
       variant="destructive"
       className="flex-1 gap-1"
       onClick={() => onReject?.(request.id)}
      >
       <X className="w-3 h-3" /> Reject
      </Button>
     </div>
    )}

    {/* Borrower: Initiate return on approved request */}
    {isBorrower && request.status === "approved" && !request.returnedAt && (
     <Button
      size="sm"
      variant="outline"
      className="w-full gap-1"
      onClick={() => onInitiateReturn?.(request.id)}
     >
      <ArrowUpFromLine className="w-3 h-3" /> Initiate Return
     </Button>
    )}

    {/* Owner: Confirm return on return_initiated request */}
    {isOwner && request.status === "return_initiated" && !request.returnedAt && (
     <Button
      size="sm"
      variant="default"
      className="w-full gap-1"
      onClick={() => onReturn?.(request.id)}
     >
      <RotateCcw className="w-3 h-3" /> Confirm Return
     </Button>
    )}

    {/* Borrower: Waiting for owner to confirm */}
    {isBorrower && request.status === "return_initiated" && !request.returnedAt && (
     <p className="text-xs text-orange-400 text-center py-1">
      ⏳ Waiting for owner to confirm return
     </p>
    )}
   </CardContent>
  </Card>
 )
}
