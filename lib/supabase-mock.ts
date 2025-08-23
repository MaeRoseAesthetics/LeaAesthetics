// Mock Supabase client for local development
// This allows you to test the frontend without setting up Supabase

const mockUser = {
  id: 'mock-user-123',
  email: 'test@example.com',
  user_metadata: { role: 'practitioner' }
};

export const supabase = {
  auth: {
    getUser: async (token?: string) => ({
      data: { user: mockUser },
      error: null
    }),
    signInWithPassword: async ({ email, password }: any) => ({
      data: { user: mockUser, session: { access_token: 'mock-token' } },
      error: null
    }),
    signUp: async ({ email, password, options }: any) => ({
      data: { user: mockUser, session: { access_token: 'mock-token' } },
      error: null
    }),
    signOut: async () => ({
      error: null
    }),
    resetPasswordForEmail: async (email: string) => ({
      error: null
    })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } })
      })
    }),
    upsert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: mockUser, error: null })
      })
    })
  })
};

// Mock database connection for local development
export const db = {
  select: () => ({
    from: () => ({
      where: () => Promise.resolve([])
    })
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([mockUser]),
      onConflictDoUpdate: () => ({
        returning: () => Promise.resolve([mockUser])
      })
    })
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => Promise.resolve([mockUser])
      })
    })
  })
};

// Auth helper functions
export const getCurrentUser = async () => mockUser;

export const signIn = async (email: string, password: string) => ({
  user: mockUser,
  session: { access_token: 'mock-token' }
});

export const signUp = async (email: string, password: string, metadata?: any) => ({
  user: mockUser,
  session: { access_token: 'mock-token' }
});

export const signOut = async () => {};

export const resetPassword = async (email: string) => {};

export const getProfile = async (userId: string) => mockUser;

export const upsertProfile = async (profile: any) => ({ ...mockUser, ...profile });

export type Profile = typeof mockUser;
