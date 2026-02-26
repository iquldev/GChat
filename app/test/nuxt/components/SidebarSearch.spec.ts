import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SidebarSearch from "~/components/sidebar/SidebarSearch.vue";

describe("SidebarSearch", () => {
  const mountSearch = async (searchQuery = "") => {
    return await mountSuspended(SidebarSearch, {
      props: {
        searchQuery,
      },
      global: {
        mocks: {
          $t: (msg: string) => {
            const translations: Record<string, string> = {
              "common.search": "Search...",
            };
            return translations[msg] || msg;
          },
        },
      },
    });
  };

  it("renders an input element", async () => {
    const wrapper = await mountSearch();
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("has correct placeholder text", async () => {
    const wrapper = await mountSearch();
    expect(wrapper.find("input").attributes("placeholder")).toBe("Search...");
  });

  it("renders with rounded-full class", async () => {
    const wrapper = await mountSearch();
    expect(wrapper.find("input").classes()).toContain("rounded-full");
  });

  it("binds the search query value", async () => {
    const wrapper = await mountSearch("test query");
    const input = wrapper.find("input");
    expect((input.element as HTMLInputElement).value).toBe("test query");
  });

  it("emits update:searchQuery on input", async () => {
    const wrapper = await mountSearch();
    const input = wrapper.find("input");
    await input.setValue("new search");
    expect(wrapper.emitted("update:searchQuery")).toBeTruthy();
    expect(wrapper.emitted("update:searchQuery")![0]).toEqual(["new search"]);
  });
});
