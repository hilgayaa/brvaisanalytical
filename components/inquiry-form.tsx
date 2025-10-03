"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function InquiryForm({ productId }: { productId?: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setSubmitting(true)
    setError(null)
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      productId: productId || null,
    }

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (json.ok) {
      setSuccess(true)
    } else {
      setError(json.error || "Failed to submit inquiry")
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="rounded-md border p-4">
        <p className="font-medium text-green-600">Thank you!</p>
        <p className="text-sm text-muted-foreground">
          Your inquiry has been received. Our team will contact you shortly.
        </p>
      </div>
    )
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name*</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email*</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="message">Message*</Label>
        <Textarea id="message" name="message" required rows={4} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Send Inquiry"}
      </Button>
    </form>
  )
}
