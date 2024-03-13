import {
  association,
  belongsToType,
  dateDataType,
  dateTimeDataType,
  field,
  hasManyType,
  manyToManyModelType,
  manyToManyTableType,
  model,
  Model,
  schema,
  Schema,
  stringDataType,
} from '@src/core/schema'
import { fromParts } from '@src/utils/dateTime'
import { STUDENT_INFO_SYSTEM_ID } from './ids'

const time = fromParts(2024, 3, 11)

enum Id {
  Student = 'CRI968kpqcwV9mjesejsH',
  Teacher = 'aZ3V8Aoer084dTsbMlgSA',
  Course = 'B2Zq8EEjSMIvtZqn9WOpl',
  CourseSection = '7t0XI-l1oFKjSVyjsqo9H',
  CourseSectionEnrollment = '0qz-0pkT6qC3LVcCe7EZk',
  CourseSectionPosition = 'srlTjbdQmPbY_IjCbA_e5',
  Topic = 'AdX1Gp1a73nEju8ClooE9',
}

const student: Model = model({
  id: Id.Student,
  name: 'student',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'first name',
      type: stringDataType({ length: 255 }),
      required: true,
    }),
    field({
      name: 'last name',
      type: stringDataType({ length: 255 }),
      required: true,
    }),
    field({
      name: 'birthdate',
      type: dateDataType(),
    }),
  ],
  associations: [
    association({
      alias: 'course section',
      sourceModelId: Id.Student,
      targetModelId: Id.CourseSection,
      type: manyToManyModelType(Id.CourseSectionEnrollment),
    }),
  ],
})

const teacher: Model = model({
  id: Id.Teacher,
  name: 'teacher',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'first name',
      type: stringDataType({ length: 255 }),
      required: true,
    }),
    field({
      name: 'last name',
      type: stringDataType({ length: 255 }),
      required: true,
    }),
    field({
      name: 'email',
      type: stringDataType({ length: 255 }),
      required: true,
      unique: true,
    }),
  ],
  associations: [
    association({
      alias: 'course section',
      sourceModelId: Id.Teacher,
      targetModelId: Id.CourseSection,
      type: manyToManyModelType(Id.CourseSectionPosition),
    }),
    association({
      alias: 'course section positions',
      sourceModelId: Id.Teacher,
      targetModelId: Id.CourseSectionPosition,
      type: hasManyType(),
    }),
  ],
})

const course: Model = model({
  id: Id.Course,
  name: 'course',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'name',
      type: stringDataType({ length: 255 }),
      required: true,
    }),
    field({
      name: 'code',
      type: stringDataType({ length: 255 }),
      required: true,
      unique: true,
    }),
  ],
  associations: [
    association({
      alias: 'section',
      sourceModelId: Id.Course,
      targetModelId: Id.CourseSection,
      type: hasManyType(),
    }),
    association({
      alias: 'topic',
      sourceModelId: Id.Course,
      targetModelId: Id.Topic,
      type: manyToManyTableType('course_topics'),
    }),
  ],
})

const courseSection: Model = model({
  id: Id.CourseSection,
  name: 'course section',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'number',
      type: stringDataType({ length: 255 }),
      required: true,
    }),
    field({
      name: 'starts at',
      type: dateTimeDataType(),
      required: true,
    }),
    field({
      name: 'ends at',
      type: dateTimeDataType(),
      required: true,
    }),
  ],
  associations: [
    association({
      sourceModelId: Id.CourseSection,
      targetModelId: Id.Course,
      type: belongsToType(),
    }),
    association({
      sourceModelId: Id.CourseSection,
      targetModelId: Id.Student,
      type: manyToManyModelType(Id.CourseSectionEnrollment),
    }),
    association({
      sourceModelId: Id.CourseSection,
      targetModelId: Id.Teacher,
      type: manyToManyModelType(Id.CourseSectionPosition),
    }),
  ],
})

const courseSectionEnrollment: Model = model({
  id: Id.CourseSectionEnrollment,
  name: 'course section enrollment',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    association({
      sourceModelId: Id.CourseSectionEnrollment,
      targetModelId: Id.CourseSection,
      type: belongsToType(),
    }),
    association({
      sourceModelId: Id.CourseSectionEnrollment,
      targetModelId: Id.Student,
      type: belongsToType(),
    }),
  ],
})

const courseSectionPosition: Model = model({
  id: Id.CourseSectionPosition,
  name: 'course section position',
  createdAt: time,
  updatedAt: time,
  fields: [],
  associations: [
    association({
      sourceModelId: Id.CourseSectionPosition,
      targetModelId: Id.CourseSection,
      type: belongsToType(),
    }),
    association({
      sourceModelId: Id.CourseSectionPosition,
      targetModelId: Id.Teacher,
      type: belongsToType(),
    }),
  ],
})

const topic: Model = model({
  id: Id.Topic,
  name: 'topic',
  createdAt: time,
  updatedAt: time,
  fields: [
    field({
      name: 'name',
      type: stringDataType({ length: 255 }),
      required: true,
      unique: true,
    }),
  ],
  associations: [],
})

const studentInformationSchema: Schema = schema({
  id: STUDENT_INFO_SYSTEM_ID,
  name: 'student info system',
  createdAt: time,
  updatedAt: time,
  models: [
    student,
    teacher,
    course,
    courseSection,
    courseSectionEnrollment,
    courseSectionPosition,
    topic,
  ],
})

export default studentInformationSchema
