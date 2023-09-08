import { createKysely } from '@vercel/postgres-kysely';
import { Generated } from 'kysely';

interface WorkHistoryTable {
  id: Generated<number>;
  title: string;
  company: string;
  organization?: string;
  city: string;
  state: string;
  desc: string;
  start_date: Date;
  end_date?: Date;
}

interface EducationTable {
  id: Generated<number>;
  school: string;
  study: string;
  city: string;
  state: string;
  notes: string;
  start_date: Date;
  end_date?: Date;
}

interface ProjectTable {
  id: Generated<number>;
  title: string;
  desc: string;
  url?: string;
  tags?: string[];
  langs?: string[];
  homepage_url?: string;
}

interface Database {
  personal_projects: ProjectTable;
  education: EducationTable;
  work_history: WorkHistoryTable;
}

const dbConnection = createKysely<Database>();

export default dbConnection;
