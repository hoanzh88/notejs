# nestjs

### Cài đặt @nestjs/cli và khởi tạo project của bạn
```
$ npm i -g @nestjs/cli
$ nest new project-name
```

### Tạo một module mới:
```
nest generate module user-module
```

### tạo controller
```
cd src/user-module
nest generate provider user-service
```

### tạo service 
```
nest generate controller user-controller
```

\src\user-module\user-service.ts
```
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
	getUser(){
		return "User";
	}	
}
```

src\user-module\user-controller\user-controller.controller.ts
```
import { Controller,Get } from '@nestjs/common';
import {UserService} from '../user-service';
@Controller('user-controller')
export class UserControllerController {
	constructor(private readonly service:UserService){}
	@Get()
	getUser(){
		return this.service.getUser()
	}
}
```

npm run start

### Bước 1: Tạo một module
```
nest generate module courses
```

### Bước 2: Tạo Controller
```
nest g controller courses
```

### Bước 3: Mock Data - data mẫu
src\courses\courses.mock.ts
```
export const COURSES = [
  {
    id: 1,
    title: 'Lập trình NodeJS thật đơn giản',
    description: 'Học lập trình NODEJS từ đầu, tự xây dựng ứng dụng từ A-Z',
    author: 'Dương Anh Sơn',
    url: 'https://vntalking.com/sach-hoc-lap-trinh-node-js-that-don-gian-html',
  },
  {
    id: 2,
    title: 'Lập trình ReactJS thật đơn giản',
    description:
      'Trở thành front-end developer nhanh chóng bằng cách tiếp cận ReactJS từ A-Z',
    author: 'VNTALKING',
    url: 'https://vntalking.com/tai-lieu-hoc-reactjs-tieng-viet',
  },
  {
    id: 3,
    title: 'Javascript toàn tập',
    description: 'Học lập trình với Javascipt từ cơ bản tới nâng cao',
    author: 'Anthony Alicea',
    url: 'https://vntalking.com',
  },
];
```

### Bước 4: Tạo mới Service
```
nest generate service courses
```

src\courses\courses.service.ts
```
import { Injectable, HttpException } from '@nestjs/common';
import { COURSES } from './courses.mock';

@Injectable()
export class CoursesService {
	courses = COURSES;
	getCourses(): Promise<any> {
		 return new Promise(resolve => {
			  resolve(this.courses);
		 });
	}
	getCourse(courseId): Promise<any> {
		 let id = Number(courseId);
		 return new Promise(resolve => {
			 const course = this.courses.find(course => course.id === id);
			 if (!course) {
				  throw new HttpException('Course does not exist', 404)
			  }
			  resolve(course);
		 });
	}
	addCourse(course): Promise<any> {
        return new Promise(resolve => {
            this.courses.push(course);
            resolve(this.courses);
        });
    }
	
	deleteCourse(courseId): Promise<any> {
        let id = Number(courseId);
        return new Promise(resolve => {
            let index = this.courses.findIndex(course => course.id === id);
            if (index === -1) {
                throw new HttpException('Course does not exist', 404);
            }
            this.courses.splice(index, 1);
            resolve(this.courses);
        });
    }
}
```

Bước 5: Cập nhật Controller
```
import { Controller, Get, Param, Post, Body, Delete, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './create-course.dto';

@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Get()
    async getCourses() {
        const courses = await this.coursesService.getCourses();
        return courses;
    }

    @Get(':courseId')
    async getCourse(@Param('courseId') courseId) {
        const course = await this.coursesService.getCourse(courseId);
        return course;
    }

    @Post()
    async addCourse(@Body() createCourseDto: CreateCourseDto) {
        const course = await this.coursesService.addCourse(createCourseDto);
        return course;
    }

    @Delete()
    async deleteCourse(@Query() query) {
        const courses = await this.coursesService.deleteCourse(query.courseId);
        return courses;
    }
}
```

Tạo file src\courses\create-course.dto
```
export class CreateCourseDto {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly author: string;
    readonly url: string;
}
```

