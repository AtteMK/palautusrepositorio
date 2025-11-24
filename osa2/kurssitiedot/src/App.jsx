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


const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    },
    {
      name: 'Fundamentals of learning',
      id: 3,
      parts: [
        {
          name: '101: How to learn',
          exercises: 5,
          id: 1
        },
        {
          name: '102: Learning in general',
          exercises: 4,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      <Course courses={courses} />
    </div>
  )
}

export default App