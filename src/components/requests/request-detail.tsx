'use client';

import { useState } from 'react';
import {
  Edit,
  MoreVertical,
  Download,
  Trash2,
  FileIcon,
  Image as ImageIcon,
  FileText,
  Upload,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { RequestDetail, getStatusColor, getStatusLabel, formatFileSize } from '@/types/request';
import {
  getRequestTypeLabel,
  getPriorityLabel,
  getPriorityColor,
} from '@/lib/validations/request.schema';
import { useRequestDetail } from '@/hooks/use-request-detail';
import { CommentSection } from './comment-section';
import { ActivityTimeline } from './activity-timeline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RequestDetailProps {
  request: RequestDetail;
  onUpdate?: (request: RequestDetail) => Promise<void>;
  canEdit?: boolean;
  canChangeStatus?: boolean;
}

export function RequestDetailComponent({
  request: initialRequest,
  onUpdate,
  canEdit = false,
  canChangeStatus = false,
}: RequestDetailProps) {
  const {
    request,
    isLoading,
    error,
    addComment,
    updateStatus,
    uploadFile,
    deleteFile,
    updateRequest,
  } = useRequestDetail({
    initialRequest,
    onUpdate,
  });

  const [activeTab, setActiveTab] = useState('details');

  // Get file icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf')) return FileText;
    return FileIcon;
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        await uploadFile(file);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Status and type badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn('border', getStatusColor(request.status))}>
                  {getStatusLabel(request.status)}
                </Badge>
                <Badge variant="outline">{getRequestTypeLabel(request.requestType)}</Badge>
                <Badge
                  variant="outline"
                  className={cn('border-2', getPriorityColor(request.priority))}
                >
                  {getPriorityLabel(request.priority)}
                </Badge>
              </div>

              {/* Title */}
              <CardTitle className="text-2xl">{request.title}</CardTitle>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{request.clientName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(request.createdAt)}</span>
                </div>
                {request.dueDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Due {formatDate(request.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canEdit && (
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Request
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                {canEdit && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Request
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({request.comments.length})
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Details tab */}
            <TabsContent value="details" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Criteria</CardTitle>
                  <CardDescription>
                    Define what success looks like for this request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {request.successCriteria.map((criterion) => (
                      <li key={criterion.id} className="flex items-start gap-3">
                        <CheckCircle2
                          className={cn(
                            'h-5 w-5 mt-0.5 flex-shrink-0',
                            criterion.completed ? 'text-green-600' : 'text-gray-400'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm',
                            criterion.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-700'
                          )}
                        >
                          {criterion.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Attachments ({request.attachments.length})</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <input
                      id="file-upload-input"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {request.attachments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No attachments yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {request.attachments.map((file) => {
                        const Icon = getFileIcon(file.type);
                        const isImage = file.type.startsWith('image/');

                        return (
                          <div
                            key={file.id}
                            className="group relative rounded-lg border bg-white hover:border-purple-300 transition-colors"
                          >
                            {isImage ? (
                              <div className="aspect-video overflow-hidden rounded-t-lg">
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-t-lg">
                                <Icon className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                                asChild
                              >
                                <a href={file.url} download={file.name}>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                              {canEdit && (
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => deleteFile(file.id)}
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments tab */}
            <TabsContent value="comments" className="mt-6">
              <CommentSection
                comments={request.comments}
                onAddComment={addComment}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Activity tab */}
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>All activity and changes for this request</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline activities={request.activities} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status change */}
          {canChangeStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={request.status}
                  onValueChange={(value) => updateStatus(value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Client info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={request.clientAvatar} />
                  <AvatarFallback>
                    {request.clientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{request.clientName}</p>
                  <p className="text-xs text-gray-500">{request.clientEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignee */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              {request.assigneeId ? (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.assigneeAvatar} />
                    <AvatarFallback>
                      {request.assigneeName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{request.assigneeName}</p>
                    <p className="text-xs text-gray-500">Team Member</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Not assigned</p>
                  {canEdit && (
                    <Button variant="outline" size="sm" className="mt-2">
                      Assign
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{formatDate(request.createdAt)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(request.updatedAt)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Timeline</span>
                <span className="font-medium">{request.estimatedTimeline}</span>
              </div>
              {request.deadline && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-medium">{formatDate(request.deadline)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Details
              </Button>
              {canEdit && (
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Request
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
