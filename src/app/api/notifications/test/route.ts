// Test endpoint for previewing and testing email templates

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { renderEmailTemplate } from '@/lib/email/templates';
import type { EmailData } from '@/types/email.types';

// Sample data for each email type
const sampleData: Record<string, EmailData> = {
  sla_warning_yellow: {
    type: 'sla_warning_yellow',
    recipient: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
    request: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Homepage Redesign',
      status: 'in_progress',
      priority: 'high',
    },
    sla: {
      hoursRemaining: 11.5,
      hoursElapsed: 36.5,
      targetHours: 48,
      warningLevel: 'yellow',
    },
    client: {
      companyName: 'Acme Corporation',
    },
    assignedTo: {
      name: 'John Designer',
    },
    requestUrl: 'https://app.designdream.is/admin/requests/123',
  },
  sla_warning_red: {
    type: 'sla_warning_red',
    recipient: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
    request: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'E-commerce Platform Development',
      status: 'in_progress',
      priority: 'urgent',
    },
    sla: {
      hoursRemaining: 4.2,
      hoursElapsed: 43.8,
      targetHours: 48,
      warningLevel: 'red',
    },
    client: {
      companyName: 'TechStart Inc',
    },
    assignedTo: {
      name: 'Sarah Developer',
    },
    requestUrl: 'https://app.designdream.is/admin/requests/123',
  },
  sla_violation: {
    type: 'sla_violation',
    recipient: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
    request: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Mobile App UI Design',
      status: 'in_progress',
      priority: 'high',
    },
    sla: {
      hoursElapsed: 52.5,
      targetHours: 48,
      hoursOverdue: 4.5,
    },
    client: {
      companyName: 'MobileFirst Apps',
    },
    assignedTo: {
      name: 'Mike Designer',
    },
    requestUrl: 'https://app.designdream.is/admin/requests/123',
  },
  new_request: {
    type: 'new_request',
    recipient: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
    request: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Landing Page Redesign',
      description:
        'We need a modern, conversion-optimized landing page for our new product launch. Should include hero section, features, testimonials, and CTA. Mobile-responsive and fast-loading.',
      type: 'design',
      priority: 'high',
    },
    client: {
      companyName: 'Growth Labs',
      contactName: 'Emily Chen',
    },
    requestUrl: 'https://app.designdream.is/admin/queue',
  },
  status_changed: {
    type: 'status_changed',
    recipient: {
      email: 'client@example.com',
      name: 'Jane',
    },
    request: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Dashboard Analytics Feature',
      oldStatus: 'in_progress',
      newStatus: 'review',
    },
    message:
      "Great news! We've completed the analytics dashboard feature and it's ready for your review. We've implemented all the requested charts and data visualizations.",
    nextSteps:
      'Please review the live demo link and let us know if you\'d like any adjustments to the design or functionality.',
    estimatedCompletion: 'Final delivery by end of this week',
    requestUrl: 'https://app.designdream.is/dashboard/requests/123',
  },
  comment_added: {
    type: 'comment_added',
    recipient: {
      email: 'admin@example.com',
      name: 'John',
    },
    request: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Website Performance Optimization',
    },
    comment: {
      content:
        "Thanks for the initial optimization! The load times are much better. However, I'm still seeing some slowness on the product pages when filtering. Can we look into optimizing those queries as well?",
      preview:
        "Thanks for the initial optimization! The load times are much better. However, I'm still seeing some slowness on the product pages...",
      authorName: 'Sarah Johnson',
      authorType: 'client',
    },
    requestUrl: 'https://app.designdream.is/admin/requests/123#comments',
  },
  welcome: {
    type: 'welcome',
    recipient: {
      email: 'newclient@example.com',
      name: 'Michael Brown',
    },
    client: {
      companyName: 'Startup Ventures',
      contactName: 'Michael Brown',
    },
    subscription: {
      planType: 'premium',
    },
    dashboardUrl: 'https://app.designdream.is/dashboard',
    resourcesUrl: 'https://app.designdream.is/resources',
  },
};

// GET handler - Preview email template in HTML
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'welcome';

  try {
    const data = sampleData[type as keyof typeof sampleData];

    if (!data) {
      return NextResponse.json(
        {
          error: 'Invalid email type',
          availableTypes: Object.keys(sampleData),
        },
        { status: 400 }
      );
    }

    // Render the template
    const html = renderEmailTemplate(data);

    // Return HTML for preview
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('[Email Test] Error rendering template:', error);
    return NextResponse.json(
      {
        error: 'Error rendering template',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST handler - Send test email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, recipient } = body;

    if (!type || !recipient) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['type', 'recipient'],
        },
        { status: 400 }
      );
    }

    const baseData = sampleData[type as keyof typeof sampleData];

    if (!baseData) {
      return NextResponse.json(
        {
          error: 'Invalid email type',
          availableTypes: Object.keys(sampleData),
        },
        { status: 400 }
      );
    }

    // Override recipient with provided email
    const data: EmailData = {
      ...baseData,
      recipient: {
        email: recipient,
        name: baseData.recipient.name,
      },
    };

    // Send the email
    const result = await sendEmail(data);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${recipient}`,
        resendId: result.id,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Email Test] Error sending test email:', error);
    return NextResponse.json(
      {
        error: 'Error sending test email',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
