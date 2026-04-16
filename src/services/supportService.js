const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const submitSupportRequest = async ({ email, topic, message }) => {
  await delay(900);
  return {
    id: `support_${Date.now()}`,
    email,
    topic,
    message,
    status: 'sent',
    submittedAt: new Date().toISOString(),
  };
};

export const supportService = {
  submitSupportRequest,
};

export default supportService;
