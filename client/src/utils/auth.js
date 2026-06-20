// Gets user from whichever storage it was saved to
export function getUser() {
  const local = localStorage.getItem("user");
  const session = sessionStorage.getItem("user");
  try {
    if (local) return JSON.parse(local);
    if (session) return JSON.parse(session);
    return null;
  } catch {
    return null;
  }
}

export function setUser(userData, remember = false) {
  const str = JSON.stringify(userData);
  if (remember) {
    localStorage.setItem("user", str);
  } else {
    sessionStorage.setItem("user", str);
  }
}

export function updateUser(updates) {
  const user = getUser();
  if (!user) return;
  const updated = { ...user, ...updates };
  // Save back to whichever storage has it
  if (localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(updated));
  } else {
    sessionStorage.setItem("user", JSON.stringify(updated));
  }
  return updated;
}

export function clearUser() {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
}