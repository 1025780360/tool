import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';

interface FilterState {
  query: string;
  category: string | null;
}

type FilterAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string | null }
  | { type: 'CLEAR' };

const initialState: FilterState = {
  query: '',
  category: null,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

const FilterContext = createContext<FilterState>(initialState);
const FilterDispatchContext = createContext<Dispatch<FilterAction>>(() => {});

export function ToolFilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  return (
    <FilterContext.Provider value={state}>
      <FilterDispatchContext.Provider value={dispatch}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterContext.Provider>
  );
}

export function useFilterState(): FilterState {
  return useContext(FilterContext);
}

export function useFilterDispatch(): Dispatch<FilterAction> {
  return useContext(FilterDispatchContext);
}
