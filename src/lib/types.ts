export type Model = {
  id: string;
  name: string;
  Icon: React.ElementType;
};

export type Interaction = {
  id: string;
  model: Model;
  prompt: string;
  response: string;
  summary: string;
};
