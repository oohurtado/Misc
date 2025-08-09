import { FormGroup } from "@angular/forms";
import { Tuple2 } from "./models/tuple.models";

export abstract class EditorBase {
    
    myForm!: FormGroup;                         // form    
    errorMessage!: string | null;               // error handling
    isProcessing!: boolean;                     // processing request

    breadcrumb: Tuple2<string,string>[] = [];   // navigation

    isFormValid() {
        if (this.myForm?.invalid || this.myForm?.status === "INVALID" || this.myForm?.status === "PENDING") {
            Object.values(this.myForm.controls)
                .forEach(control => {
                    control.markAsTouched();
                });

            return false;
        }

        return true;
    }

    hasError(nameField: string, errorCode: string) {
        return this.myForm?.get(nameField)?.hasError(errorCode) && this.myForm?.get(nameField)?.touched;
    }    
}