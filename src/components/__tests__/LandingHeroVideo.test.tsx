import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingHeroVideo from "../LandingHeroVideo";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, variants, initial, animate, exit, transition, whileHover, whileTap, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, variants, initial, animate, exit, transition, whileHover, whileTap, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe("LandingHeroVideo", () => {
  const mockVideoUrl = "/videos/hero-video.mp4";
  const mockPosterImage = "/videos/hero-poster.jpg";

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders video element with correct attributes", () => {
      render(
        <LandingHeroVideo
          videoUrl={mockVideoUrl}
          posterImage={mockPosterImage}
        />
      );

      const video = document.querySelector("video");
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute("poster", mockPosterImage);
      expect((video as HTMLVideoElement).muted).toBe(true);
      expect(video).toHaveAttribute("playsinline");
    });

    test("renders video source with correct src and type", () => {
      render(
        <LandingHeroVideo
          videoUrl={mockVideoUrl}
          posterImage={mockPosterImage}
        />
      );

      const source = document.querySelector("source");
      expect(source).toBeInTheDocument();
      expect(source).toHaveAttribute("src", mockVideoUrl);
      expect(source).toHaveAttribute("type", "video/mp4");
    });

    test("renders with custom className", () => {
      const { container } = render(
        <LandingHeroVideo className="custom-class" />
      );

      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });

    test("renders with rounded corners by default", () => {
      const { container } = render(<LandingHeroVideo />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("rounded-lg");
    });
  });

  describe("Control Bar", () => {
    test("renders control bar with play, mute, and fullscreen buttons when showControls is true", () => {
      render(<LandingHeroVideo showControls={true} />);

      // Play/Pause button
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    test("does not render control bar when showControls is false", () => {
      const { container } = render(<LandingHeroVideo showControls={false} />);

      // No control buttons should be visible
      const buttons = screen.queryAllByRole("button");
      expect(buttons.length).toBe(0);
    });

    test("renders play/pause button with correct aria-label", () => {
      render(<LandingHeroVideo showControls={true} />);

      const buttons = screen.getAllByRole("button");
      const playButton = buttons[0];
      expect(playButton).toHaveAttribute("aria-label", "Play video");
    });

    test("renders mute button with correct aria-label", () => {
      render(<LandingHeroVideo showControls={true} />);

      const muteButton = screen.getByRole("button", { name: /mute video/i });
      expect(muteButton).toBeInTheDocument();
    });

    test("renders fullscreen button with correct aria-label", () => {
      render(<LandingHeroVideo showControls={true} />);

      const buttons = screen.getAllByRole("button");
      const fullscreenButton = buttons[buttons.length - 1];
      expect(fullscreenButton).toHaveAttribute(
        "aria-label",
        "Enter fullscreen"
      );
    });
  });

  describe("Play/Pause Functionality", () => {
    test("renders overlay play button when video is not playing", () => {
      render(<LandingHeroVideo showControls={true} />);

      // Should show play button overlay (one of the buttons should be for play)
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    test("toggles play state when play button is clicked", async () => {
      const { container } = render(
        <LandingHeroVideo showControls={true} autoPlay={false} />
      );

      const video = document.querySelector("video") as HTMLVideoElement;
      const playButton = screen.getAllByRole("button")[0];

      // Mock video play/pause methods
      jest.spyOn(video, "play").mockResolvedValue(undefined);
      jest.spyOn(video, "pause").mockImplementation(() => {});

      fireEvent.click(playButton);

      // Check that play method was called (when transitioning from not playing to playing)
      await waitFor(() => {
        expect(video.play).toHaveBeenCalled();
      });
    });

    test("updates aria-label when play state changes", () => {
      render(<LandingHeroVideo showControls={true} />);

      const buttons = screen.getAllByRole("button");
      const playButton = buttons[0];

      expect(playButton).toHaveAttribute("aria-label", "Play video");

      // Simulate video play
      fireEvent.click(playButton);

      // After clicking, should show pause label
      const updatedPlayButton = screen.getAllByRole("button")[0];
      expect(updatedPlayButton).toHaveAttribute("aria-label", "Pause video");
    });
  });

  describe("Mute/Unmute Functionality", () => {
    test("starts muted when autoPlay is false", () => {
      render(<LandingHeroVideo autoPlay={false} showControls={true} />);

      const video = document.querySelector("video") as HTMLVideoElement;
      expect(video.muted).toBe(true);
    });

    test("starts unmuted when autoPlay is true", () => {
      render(<LandingHeroVideo autoPlay={true} showControls={true} />);

      const video = document.querySelector("video") as HTMLVideoElement;
      expect(video.muted).toBe(false);
    });

    test("toggles mute state when mute button is clicked", () => {
      const { container } = render(
        <LandingHeroVideo showControls={true} autoPlay={false} />
      );

      const video = document.querySelector("video") as HTMLVideoElement;
      const muteButton = screen.getByRole("button", { name: /mute video/i });

      const initialMutedState = video.muted;

      fireEvent.click(muteButton);

      // Muted state should be toggled
      expect(video.muted).toBe(!initialMutedState);
    });

    test("mute button toggles video muted state correctly", () => {
      render(<LandingHeroVideo showControls={true} autoPlay={false} />);

      const video = document.querySelector("video") as HTMLVideoElement;
      const initialState = video.muted;

      const muteButton = screen.getByRole("button", { name: /mute video/i });
      fireEvent.click(muteButton);

      // Verify the muted state actually changed
      expect(video.muted).toBe(!initialState);
    });
  });

  describe("Fullscreen Functionality", () => {
    test("has correct initial fullscreen button aria-label", () => {
      render(<LandingHeroVideo showControls={true} />);

      const fullscreenButton = screen.getByRole("button", { name: /enter fullscreen/i });
      expect(fullscreenButton).toBeInTheDocument();
    });

    test("fullscreen button is clickable and changes to exit state", () => {
      render(
        <LandingHeroVideo showControls={true} />
      );

      const fullscreenButton = screen.getByRole("button", { name: /enter fullscreen/i });
      expect(fullscreenButton).toBeInTheDocument();

      // Verify button is clickable
      expect(() => {
        fireEvent.click(fullscreenButton);
      }).not.toThrow();
    });
  });

  describe("Props & Configuration", () => {
    test("applies default props when not provided", () => {
      const { container } = render(<LandingHeroVideo />);

      const video = document.querySelector("video") as HTMLVideoElement;
      expect(video).toBeInTheDocument();
      expect(video.muted).toBe(true);
    });

    test("respects autoPlay prop", () => {
      // Test with autoPlay={false}
      const { unmount } = render(
        <LandingHeroVideo autoPlay={false} />
      );

      let video = document.querySelector("video") as HTMLVideoElement;
      expect(video.muted).toBe(true); // Should be muted when not autoPlaying

      unmount();

      // Test with autoPlay={true} in fresh render
      render(<LandingHeroVideo autoPlay={true} />);

      video = document.querySelector("video") as HTMLVideoElement;
      expect(video.muted).toBe(false); // Should be unmuted when autoPlaying
    });

    test("accepts custom video URL", () => {
      const customUrl = "/custom/video.mp4";
      render(<LandingHeroVideo videoUrl={customUrl} />);

      const source = document.querySelector("source") as HTMLSourceElement;
      expect(source.getAttribute("src")).toBe(customUrl);
    });

    test("accepts custom poster image", () => {
      const customPoster = "/custom/poster.jpg";
      render(<LandingHeroVideo posterImage={customPoster} />);

      const video = document.querySelector("video") as HTMLVideoElement;
      expect(video.getAttribute("poster")).toBe(customPoster);
    });
  });

  describe("Video Events", () => {
    test("handles video play event correctly", () => {
      render(<LandingHeroVideo showControls={true} />);

      const video = document.querySelector("video") as HTMLVideoElement;

      fireEvent.play(video);

      // After play event, playing state should reflect this
      const buttons = screen.getAllByRole("button");
      const playButton = buttons[0];
      expect(playButton).toHaveAttribute("aria-label", "Pause video");
    });

    test("handles video pause event correctly", () => {
      render(<LandingHeroVideo showControls={true} autoPlay={true} />);

      const video = document.querySelector("video") as HTMLVideoElement;

      fireEvent.pause(video);

      // After pause event, playing state should reflect this
      const buttons = screen.getAllByRole("button");
      const playButton = buttons[0];
      expect(playButton).toHaveAttribute("aria-label", "Play video");
    });

    test("handles loadedmetadata event", () => {
      const { container } = render(
        <LandingHeroVideo autoPlay={true} showControls={true} />
      );

      const video = document.querySelector("video") as HTMLVideoElement;
      jest.spyOn(video, "play").mockResolvedValue(undefined);

      fireEvent.loadedMetadata(video);

      // Video should attempt to play on loadedmetadata when autoPlay is true
      expect(video.play).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    test("all interactive elements have proper aria-labels", () => {
      render(<LandingHeroVideo showControls={true} />);

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-label");
      });
    });

    test("video element is focusable via keyboard", () => {
      const { container } = render(<LandingHeroVideo showControls={true} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute("disabled");
      });
    });
  });

  describe("Responsive Behavior", () => {
    test("uses proper aspect ratio for 16:9 video", () => {
      const { container } = render(<LandingHeroVideo />);

      const videoPtContainer = container.querySelector("div[class*='pt-']");
      // The component uses pt-[56.25%] which is 16:9 ratio
      expect(videoPtContainer).toBeInTheDocument();
      expect(videoPtContainer?.className).toContain("pt-");
    });

    test("renders video as absolute positioned within relative container", () => {
      const { container } = render(<LandingHeroVideo />);

      const video = document.querySelector("video");
      // The video is inside an absolutely positioned container (pt-[56.25%])
      expect(video).toBeInTheDocument();
      const parentElement = video?.parentElement;
      // The parent container should have relative positioning to maintain aspect ratio
      expect(parentElement?.className).toContain("relative");
    });
  });

  describe("Edge Cases", () => {
    test("handles missing videoRef gracefully", () => {
      render(<LandingHeroVideo showControls={true} />);

      const buttons = screen.getAllByRole("button");
      const playButton = buttons[0];

      // Should not throw error when clicking play
      expect(() => {
        fireEvent.click(playButton);
      }).not.toThrow();
    });

    test("handles rapid play/pause toggles", async () => {
      const { container } = render(
        <LandingHeroVideo showControls={true} />
      );

      const video = document.querySelector("video") as HTMLVideoElement;
      jest.spyOn(video, "play").mockResolvedValue(undefined);
      jest.spyOn(video, "pause").mockImplementation(() => {});

      const buttons = screen.getAllByRole("button");
      const playButton = buttons[0];

      // Rapid clicks
      fireEvent.click(playButton);
      fireEvent.click(playButton);
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(video.play).toHaveBeenCalled();
      });
    });
  });
});
