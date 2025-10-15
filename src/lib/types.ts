export type Model = {
  id: string;
  name: string;
  Icon: React.ElementType;
};

export type IndividualResponse = {
  model: Model;
  response: string;
  summary: string;
};

export type Interaction = {
  id: string;
  model: Model; // The model selected for the interaction (can be ALL_MODELS_OPTION)
  prompt: string;
  response: string | IndividualResponse[]; // string for single, array for all
  summary: string;
};
