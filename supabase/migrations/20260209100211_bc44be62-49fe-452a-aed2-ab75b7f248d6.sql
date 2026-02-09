
-- ============================================================
-- SIGNMAKER.AI — FOREVER MEMORY INFRASTRUCTURE (FINAL)
-- ============================================================

-- 1. ROLES & AUTHORIZATION
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. USER PROFILES (MINIMAL)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  specialty TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. USER MEMORIES (STRUCTURED DECISION MEMORY)
CREATE TABLE public.user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'standard',
  memory_scope TEXT NOT NULL DEFAULT 'personal',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;

-- Validation trigger for confidence
CREATE OR REPLACE FUNCTION public.validate_memory_confidence()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.confidence NOT IN ('tentative', 'standard', 'strict') THEN
    RAISE EXCEPTION 'Invalid confidence value: %. Must be tentative, standard, or strict.', NEW.confidence;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_memory_confidence
  BEFORE INSERT OR UPDATE ON public.user_memories
  FOR EACH ROW EXECUTE FUNCTION public.validate_memory_confidence();

-- Validation trigger for memory_scope
CREATE OR REPLACE FUNCTION public.validate_memory_scope()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.memory_scope NOT IN ('personal') THEN
    RAISE EXCEPTION 'Invalid memory_scope value: %. Must be personal.', NEW.memory_scope;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_memory_scope
  BEFORE INSERT OR UPDATE ON public.user_memories
  FOR EACH ROW EXECUTE FUNCTION public.validate_memory_scope();

-- Validation trigger for memory_type (controlled vocabulary)
CREATE OR REPLACE FUNCTION public.validate_memory_type()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.memory_type NOT IN ('preference', 'constraint', 'rule_of_thumb', 'risk_tolerance', 'supplier_exclusion') THEN
    RAISE EXCEPTION 'Invalid memory_type value: %. Must be one of: preference, constraint, rule_of_thumb, risk_tolerance, supplier_exclusion.', NEW.memory_type;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_memory_type
  BEFORE INSERT OR UPDATE ON public.user_memories
  FOR EACH ROW EXECUTE FUNCTION public.validate_memory_type();

CREATE INDEX idx_user_memories_tags ON public.user_memories USING GIN(tags);

CREATE POLICY "Users can read own memories"
  ON public.user_memories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memories"
  ON public.user_memories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memories"
  ON public.user_memories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own memories"
  ON public.user_memories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. COMPANY MEMBERSHIP
CREATE TABLE public.company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.user_in_company(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_members
    WHERE user_id = _user_id AND company_id = _company_id
  )
$$;

CREATE POLICY "Users can see own memberships"
  ON public.company_members FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage memberships"
  ON public.company_members FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. COMPANY KNOWLEDGE (COMPANY-SCOPED, NO SOCIAL MECHANICS)
CREATE TABLE public.company_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_knowledge ENABLE ROW LEVEL SECURITY;

-- Validation trigger for status
CREATE OR REPLACE FUNCTION public.validate_knowledge_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status value: %. Must be pending, approved, or rejected.', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_knowledge_status
  BEFORE INSERT OR UPDATE ON public.company_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.validate_knowledge_status();

CREATE INDEX idx_company_knowledge_tags ON public.company_knowledge USING GIN(tags);

CREATE POLICY "Company members can read approved knowledge"
  ON public.company_knowledge FOR SELECT
  TO authenticated
  USING (
    status = 'approved'
    AND public.user_in_company(auth.uid(), company_id)
  );

CREATE POLICY "Users can submit knowledge to own company"
  ON public.company_knowledge FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_in_company(auth.uid(), company_id)
    AND submitted_by = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY "Admins can manage company knowledge"
  ON public.company_knowledge FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND public.user_in_company(auth.uid(), company_id)
  );

-- 6. CONVERSATIONS (PERSISTENT CHAT)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. MESSAGES (OWNED VIA PARENT CONVERSATION)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages in own conversations"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- 8. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_memories_updated_at
  BEFORE UPDATE ON public.user_memories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_knowledge_updated_at
  BEFORE UPDATE ON public.company_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
