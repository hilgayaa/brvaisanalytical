import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { Mail, Phone, Calendar } from "lucide-react"

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: "pending" | "in-progress" | "resolved" | "closed"
  createdAt: string
}

interface InquiryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inquiry: Inquiry | null
}

export function InquiryDialog({ open, onOpenChange, inquiry }: InquiryDialogProps) {
  if (!inquiry) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "closed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Inquiry Details</DialogTitle>
            <Badge variant="secondary" className={getStatusColor(inquiry.status)}>
              {inquiry.status}
            </Badge>
          </div>
          <DialogDescription>View complete inquiry information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{inquiry.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                  {inquiry.email}
                </a>
              </div>

              {inquiry.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                    {inquiry.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Subject</h3>
            <p className="text-foreground">{inquiry.subject}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Message</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
