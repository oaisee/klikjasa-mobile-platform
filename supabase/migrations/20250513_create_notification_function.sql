
-- Create a function to safely create notifications
-- This function will run with security definer so it can bypass RLS
CREATE OR REPLACE FUNCTION public.create_user_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_content TEXT,
  p_data JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content,
    data
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_content,
    p_data
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_notification TO authenticated;
