import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

interface Testimonial {
  message: string;
  name: string;
  position: string;
  image: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule,CarouselModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  
  testimonials: Testimonial[] = [
    {
      message: 'En menos de <strong>1 mes</strong> he vendido <strong>4 proyectos</strong>, uno de ellos ha sido por más de <strong>$5,000 USD</strong>. <br> <br> Un hito más de ventas.',
      name: 'David Trujillo Carrero',
      position: 'Estrategia digital, Españita',
      image: 'assets/artem.jpg',
    },
    {
      message: 'Logré agendar 3 llamadas de las cuáles <strong> cerré una de 2500€ </strong>. <br> <br> Estudié un video, cada paso, cada palabra, cada forma de resolver una objeción. Estuve 3 horas y logré armar mi estructura de ventas. <br> <br> Practiqué un roleplay y después de eso me sentía super seguro.',
      name: 'Rubén Trujillo Carrero',
      position: 'Productor de contenidos, Españita',
      image: 'assets/artem.jpg',
    },

    {
      message: 'Ewe agendar 3 llamadas de las cuáles <strong> cerré una de 2500€ </strong>. <br> <br> Estudié un video, cada paso, cada palabra, cada forma de resolver una objeción. Estuve 3 horas y logré armar mi estructura de ventas. <br> <br> Practiqué un roleplay y después de eso me sentía super seguro.',
      name: 'Julián Lucero',
      position: 'Productor de contenidos, Argentina',
      image: 'assets/artem.jpg',
    },

    {
      message: 'Awa agendar 3 llamadas de las cuáles <strong> cerré una de 2500€ </strong>. <br> <br> Estudié un video, cada paso, cada palabra, cada forma de resolver una objeción. Estuve 3 horas y logré armar mi estructura de ventas. <br> <br> Practiqué un roleplay y después de eso me sentía super seguro.',
      name: 'Benito Camela',
      position: 'Productor de contenidos, Argentina',
      image: 'assets/artem.jpg',
    },
    
  ];

  constructor() {}

  

}
