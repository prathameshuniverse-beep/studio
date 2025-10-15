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
  // string for single, array for all. The array can be of full IndividualResponse or the light version
  response: string | (IndividualResponse | Omit<IndividualResponse, 'model'> & { model: { id: string; name: string } })[];
  summary: string;
};
