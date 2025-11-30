const Header = ({header}) => {
  return (
    <>
      <h2>{header}</h2>
    </>
  )
}

const Content = ({parts}) => {
  console.log('Content:', parts)
  return (
    <>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </>
  )
}

const Total = ({parts}) => {
  const totalExercises = parts.reduce( (s, p) => {
    return s + p.exercises
  }, 0)
  return (
    <>
      <b>total of {totalExercises} exercises</b>
    </>
  )
}

const Part = ({part}) => {
  console.log('Part:', part)
  return (
    <li>{part.name} {part.exercises}</li>
  )
}

const Course = ({courses}) => {
  console.log('Course:', courses)
    return (
    <>
      {courses.map(course => 
        <Display key={course.id} course={course} />
      )}
    </>
  )
}

const Display = ({course}) => {
  console.log('Display:', {course})
  return (
    <>
    <Header header={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
    </>
  )
}

export default Course