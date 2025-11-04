'use client';

import { Download, ExternalLink, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Invoice } from '@/types/billing.types';
import { formatStripeAmount, formatShortDate } from '@/lib/stripe';

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const getStatusVariant = (
    status: Invoice['status']
  ): 'success' | 'warning' | 'destructive' | 'default' | 'secondary' => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'open':
        return 'warning';
      case 'void':
      case 'uncollectible':
        return 'destructive';
      case 'draft':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Invoice['status']): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>View and download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">No invoices yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your invoice history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>
          View and download past invoices ({invoices.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {invoice.number || invoice.id.substring(0, 8)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {formatShortDate(invoice.created)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatShortDate(invoice.periodStart)} -{' '}
                        {formatShortDate(invoice.periodEnd)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {formatStripeAmount(invoice.amountPaid)}
                      </p>
                      {invoice.amountDue !== invoice.amountPaid && (
                        <p className="text-xs text-muted-foreground">
                          Due: {formatStripeAmount(invoice.amountDue)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {invoice.hostedInvoiceUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={invoice.hostedInvoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {invoice.pdfUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={invoice.pdfUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Total paid this year
          </p>
          <p className="text-lg font-bold">
            {formatStripeAmount(
              invoices
                .filter((inv) => inv.status === 'paid')
                .reduce((sum, inv) => sum + inv.amountPaid, 0)
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
