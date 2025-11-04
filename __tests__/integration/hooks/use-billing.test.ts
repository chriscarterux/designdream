import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBilling } from '@/hooks/use-billing';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('useBilling Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should return null billing data when no customerId provided', () => {
      const { result } = renderHook(() => useBilling());

      expect(result.current.billingData).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should provide all hook methods', () => {
      const { result } = renderHook(() => useBilling());

      expect(typeof result.current.refresh).toBe('function');
      expect(typeof result.current.executeAction).toBe('function');
      expect(result.current.isExecutingAction).toBe(false);
    });
  });

  describe('Action Execution', () => {
    it('should handle action network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      let actionResult;
      await act(async () => {
        actionResult = await result.current.executeAction('cancel');
      });

      expect(actionResult?.success).toBe(false);
      expect(actionResult?.message).toContain('Network error');
    });

    it('should send POST request to correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      await act(async () => {
        await result.current.executeAction('cancel');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/billing/actions',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('Hook API', () => {
    it('should expose refresh function', () => {
      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      expect(typeof result.current.refresh).toBe('function');

      // Should not throw when called
      act(() => {
        result.current.refresh();
      });
    });

    it('should provide isExecutingAction state', () => {
      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      expect(result.current.isExecutingAction).toBe(false);
    });
  });

  describe('Action Types', () => {
    it('should accept cancel action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      await act(async () => {
        await result.current.executeAction('cancel');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/billing/actions',
        expect.objectContaining({
          body: JSON.stringify({
            action: 'cancel',
            customerId: 'cus_123',
          }),
        })
      );
    });

    it('should accept resume action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      await act(async () => {
        await result.current.executeAction('resume');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/billing/actions',
        expect.objectContaining({
          body: JSON.stringify({
            action: 'resume',
            customerId: 'cus_123',
          }),
        })
      );
    });

    it('should accept pause action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      await act(async () => {
        await result.current.executeAction('pause');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/billing/actions',
        expect.objectContaining({
          body: JSON.stringify({
            action: 'pause',
            customerId: 'cus_123',
          }),
        })
      );
    });

    it('should accept unpause action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      await act(async () => {
        await result.current.executeAction('unpause');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/billing/actions',
        expect.objectContaining({
          body: JSON.stringify({
            action: 'unpause',
            customerId: 'cus_123',
          }),
        })
      );
    });
  });

  describe('Request Payload', () => {
    it('should send correct request headers and body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_test_123' })
      );

      await act(async () => {
        await result.current.executeAction('cancel');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/billing/actions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'cancel',
            customerId: 'cus_test_123',
          }),
        })
      );
    });

    it('should include customerId in request body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const customerId = 'cus_unique_test_id';
      const { result } = renderHook(() => useBilling({ customerId }));

      await act(async () => {
        await result.current.executeAction('cancel');
      });

      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.customerId).toBe(customerId);
    });
  });

  describe('Error Handling', () => {
    it('should return error on failed action', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, error: 'Failed' }),
      });

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      let actionResult;
      await act(async () => {
        actionResult = await result.current.executeAction('cancel');
      });

      expect(actionResult?.success).toBe(false);
    });

    it('should handle exceptions during action execution', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Unexpected error'));

      const { result } = renderHook(() =>
        useBilling({ customerId: 'cus_123' })
      );

      let actionResult;
      await act(async () => {
        actionResult = await result.current.executeAction('cancel');
      });

      expect(actionResult?.success).toBe(false);
      expect(actionResult?.message).toBeDefined();
    });
  });
});
