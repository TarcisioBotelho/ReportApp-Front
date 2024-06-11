export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: undefined;
    ResetPassword: undefined;
    MyReports: undefined;
    Home: undefined;
  ReportDetails: { report: Report };
  EditReport: { report: Report };
  Profile: undefined;
  // Outras rotas aqui
};

export interface Report {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  type: {
    id: number;
    name: string;
  };
  // Adicione outros campos conforme necessário
  };