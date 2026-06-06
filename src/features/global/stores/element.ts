import { create } from 'zustand';

type ElementState = {
  elements: string[];

  showElement: (elementName: string) => void;

  hideElement: (elementName: string) => void;
};

export const useElementState = create<ElementState>()((set) => ({
  elements: [],

  showElement: (elementName) =>
    set((state) => ({
      elements: state.elements.includes(elementName)
        ? state.elements
        : [...state.elements, elementName],
    })),

  hideElement: (elementName) =>
    set((state) => ({
      elements: state.elements.filter((m) => m !== elementName),
    })),
}));
