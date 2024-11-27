import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import EditorComponent from './editor.component';
import { QueryLLMService } from '../../services/queryLLM.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let queryLLMService: jasmine.SpyObj<QueryLLMService>;

  beforeEach(async () => {
    const queryLLMServiceSpy = jasmine.createSpyObj('QueryLLMService', ['query']);

    await TestBed.configureTestingModule({
      declarations: [EditorComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: QueryLLMService, useValue: queryLLMServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    queryLLMService = TestBed.inject(QueryLLMService) as jasmine.SpyObj<QueryLLMService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSubmitting to true when submitForm is called', () => {
    component.submitForm();
    expect(component.isSubmitting).toBeTrue();
  });

  it('should call articleService.query with the correct query', () => {
    const query = 'Test query';
    component.articleForm.setValue({ body: query });
    queryLLMService.query.and.returnValue(of({ choices: [{ message: { content: 'Test response' } }] }));

    component.submitForm();

    expect(queryLLMService.query).toHaveBeenCalledWith(query);
  });

  it('should add a new chat entry when a response is received', () => {
    const query = 'Test query';
    const responseText = 'Test response';
    component.articleForm.setValue({ body: query });
    queryLLMService.query.and.returnValue(of({ choices: [{ message: { content: responseText } }] }));

    component.submitForm();

    expect(component.chatEntries.length).toBe(1);
    expect(component.chatEntries[0]).toEqual({ query, response: responseText });
  });

  it('should reset the form after a response is received', () => {
    const query = 'Test query';
    component.articleForm.setValue({ body: query });
    queryLLMService.query.and.returnValue(of({ choices: [{ message: { content: 'Test response' } }] }));

    component.submitForm();

    expect(component.articleForm.get('body')?.value).toBe('');
  });

  it('should set isSubmitting to false after a response is received', () => {
    const query = 'Test query';
    component.articleForm.setValue({ body: query });
    queryLLMService.query.and.returnValue(of({ choices: [{ message: { content: 'Test response' } }] }));

    component.submitForm();

    expect(component.isSubmitting).toBeFalse();
  });
});