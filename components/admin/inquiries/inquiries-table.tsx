"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Trash2, Search, Download } from "lucide-react"
import { InquiryDialog } from "./inquiries-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm"
// import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

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

export function InquiriesTable() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInquiries, setSelectedInquiries] = useState<number[]>([])
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null)
  const [deletingInquiry, setDeletingInquiry] = useState<Inquiry | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [searchTerm, statusFilter])

  async function fetchInquiries() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/inquiries?${params}`, {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
      })
      const data = await response.json()
      setInquiries(data.inquiries || [])
    } catch (error) {
      console.error("[v0] Failed to fetch inquiries:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to fetch inquiries",
    //     variant: "destructive",
    //   })
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(id: number, status: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/inquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: "Status updated successfully",
        // })

        fetchInquiries()
      }
    } catch (error) {
      console.error("[v0] Failed to update status:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update status",
    //     variant: "destructive",
    //   })
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
      })

      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: "Inquiry deleted successfully",
        // })
        fetchInquiries()
      }
    } catch (error) {
      console.error("[v0] Failed to delete inquiry:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete inquiry",
    //     variant: "destructive",
    //   })
    }
  }

  async function handleBulkStatusUpdate(status: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/inquiries/bulk-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
        body: JSON.stringify({ ids: selectedInquiries, status }),
      })

      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: `${selectedInquiries.length} inquiries updated`,
        // })
        setSelectedInquiries([])
        fetchInquiries()
      }
    } catch (error) {
      console.error("[v0] Failed to bulk update:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update inquiries",
    //     variant: "destructive",
    //   })
    }
  }

  async function handleBulkDelete() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/inquiries/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
        body: JSON.stringify({ ids: selectedInquiries }),
      })

      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: `${selectedInquiries.length} inquiries deleted`,
        // })
        setSelectedInquiries([])
        fetchInquiries()
      }
    } catch (error) {
      console.error("[v0] Failed to bulk delete:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete inquiries",
    //     variant: "destructive",
    //   })
    }
  }

  async function handleExport() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/inquiries/export`, {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "inquiries.csv"
      a.click()
    } catch (error) {
      console.error("[v0] Failed to export:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to export inquiries",
    //     variant: "destructive",
    //   })
    // }
  }

  const toggleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([])
    } else {
      setSelectedInquiries(inquiries.map((i) => i.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedInquiries((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {selectedInquiries.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedInquiries.length} selected</span>
          <Select onValueChange={handleBulkStatusUpdate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Mark as Pending</SelectItem>
              <SelectItem value="in-progress">Mark as In Progress</SelectItem>
              <SelectItem value="resolved">Mark as Resolved</SelectItem>
              <SelectItem value="closed">Mark as Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedInquiries.length === inquiries.length} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedInquiries.includes(inquiry.id)}
                      onCheckedChange={() => toggleSelect(inquiry.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{inquiry.subject}</TableCell>
                  <TableCell>
                    <Select value={inquiry.status} onValueChange={(value) => handleStatusUpdate(inquiry.id, value)}>
                      <SelectTrigger className="w-[140px]">
                        <Badge variant="secondary" className={getStatusColor(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setViewingInquiry(inquiry)
                          setDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingInquiry(inquiry)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <InquiryDialog
        open={dialogOpen}
        onOpenChange={(open:any) => {
          setDialogOpen(open)
          if (!open) setViewingInquiry(null)
        }}
        inquiry={viewingInquiry}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (deletingInquiry) {
            handleDelete(deletingInquiry.id)
            setDeleteDialogOpen(false)
            setDeletingInquiry(null)
          }
        }}
        title="Delete Inquiry"
        description={`Are you sure you want to delete this inquiry from "${deletingInquiry?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
}
