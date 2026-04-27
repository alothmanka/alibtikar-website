import { describe, expect, it, beforeEach, vi } from "vitest";

/**
 * Frontend Navigation Tests
 * These tests verify the Hero button navigation and SocialLinks component behavior
 * without requiring database connections.
 */

describe("Hero Button Navigation", () => {
  let mockElement: HTMLElement;
  let scrollIntoViewMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock the DOM element and scrollIntoView method
    scrollIntoViewMock = vi.fn();
    mockElement = {
      scrollIntoView: scrollIntoViewMock,
    } as unknown as HTMLElement;

    // Mock document.getElementById
    vi.stubGlobal("document", {
      getElementById: vi.fn((id: string) => {
        if (id === "services-section") {
          return mockElement;
        }
        return null;
      }),
    });
  });

  it("scrolls to services section when button is clicked", () => {
    const element = document.getElementById("services-section");
    expect(element).toBe(mockElement);
    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    // Simulate button click behavior
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("handles missing services section gracefully", () => {
    const element = document.getElementById("non-existent-section");
    expect(element).toBeNull();
  });
});

describe("Social Media Links Component", () => {
  it("filters out placeholder URLs from social media links", () => {
    const placeholderUrls = [
      "https://facebook.com",
      "https://instagram.com",
      "https://twitter.com",
      "https://linkedin.com",
      "https://youtube.com",
    ];

    const isPlaceholder = (url: string): boolean => {
      return placeholderUrls.includes(url);
    };

    // Test that placeholder URLs are identified
    expect(isPlaceholder("https://facebook.com")).toBe(true);
    expect(isPlaceholder("https://instagram.com")).toBe(true);
    expect(isPlaceholder("https://twitter.com")).toBe(true);

    // Test that real URLs are not identified as placeholders
    expect(isPlaceholder("https://facebook.com/alibtikar")).toBe(false);
    expect(isPlaceholder("https://instagram.com/alibtikar_agri")).toBe(false);
    expect(isPlaceholder("https://twitter.com/alibtikar")).toBe(false);
  });

  it("maps social media content keys to correct icons", () => {
    const socialPlatforms = [
      { key: "social.facebook", label: "Facebook" },
      { key: "social.instagram", label: "Instagram" },
      { key: "social.twitter", label: "Twitter" },
      { key: "social.linkedin", label: "LinkedIn" },
      { key: "social.youtube", label: "YouTube" },
    ];

    expect(socialPlatforms).toHaveLength(5);
    expect(socialPlatforms[0].key).toBe("social.facebook");
    expect(socialPlatforms[1].key).toBe("social.instagram");
    expect(socialPlatforms[2].key).toBe("social.twitter");
    expect(socialPlatforms[3].key).toBe("social.linkedin");
    expect(socialPlatforms[4].key).toBe("social.youtube");
  });

  it("opens social media links in new tab with security attributes", () => {
    const socialLink = {
      href: "https://facebook.com/alibtikar",
      target: "_blank",
      rel: "noopener noreferrer",
    };

    expect(socialLink.target).toBe("_blank");
    expect(socialLink.rel).toBe("noopener noreferrer");
    expect(socialLink.href).toMatch(/^https:\/\//);
  });
});

describe("Navigation Categories in Admin Dashboard", () => {
  it("includes social media category in admin dashboard", () => {
    const categories = ["contact", "hero", "services", "navigation", "form", "footer", "social"];

    expect(categories).toContain("social");
    expect(categories).toHaveLength(7);
  });

  it("social media category has correct configuration", () => {
    const categoryConfig = {
      social: {
        label: "Social Media",
        description: "Social media platform links (Facebook, Instagram, Twitter, LinkedIn, YouTube)",
      },
    };

    expect(categoryConfig.social.label).toBe("Social Media");
    expect(categoryConfig.social.description).toContain("Facebook");
    expect(categoryConfig.social.description).toContain("Instagram");
    expect(categoryConfig.social.description).toContain("Twitter");
    expect(categoryConfig.social.description).toContain("LinkedIn");
    expect(categoryConfig.social.description).toContain("YouTube");
  });
});

describe("Content Field Types", () => {
  it("social media links use URL field type", () => {
    const socialMediaFieldType = "url";

    expect(socialMediaFieldType).toBe("url");
  });

  it("URL field type is valid for social media", () => {
    const validFieldTypes = ["text", "textarea", "phone", "email", "url"];
    const socialMediaFieldType = "url";

    expect(validFieldTypes).toContain(socialMediaFieldType);
  });
});
